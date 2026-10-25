const MODEL_URL = "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.tar.gz";
const DB_NAME = "meh-vosk-model-cache";
const STORE = "models";
function openDb() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}
async function getModelBlob() {
    const db = await openDb();
    const cached = await new Promise((resolve, reject) => {
        const req = db.transaction(STORE, "readonly").objectStore(STORE).get(MODEL_URL);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
    });
    if (cached instanceof Blob) { db.close(); return cached; }
    const response = await fetch(MODEL_URL);
    if (!response.ok) { db.close(); throw new Error(`Model download failed: HTTP ${response.status}`); }
    const blob = await response.blob();
    await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(blob, MODEL_URL);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
    db.close();
    return blob;
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || !["MEH_MODEL_META", "MEH_MODEL_CHUNK"].includes(message.type)) return;
    (async () => {
        const blob = await getModelBlob();
        if (message.type === "MEH_MODEL_META") {
            sendResponse({ok:true,size:blob.size});
            return;
        }
        const start = Math.max(0, Number(message.offset) || 0);
        const end = Math.min(blob.size, start + 512 * 1024);
        const bytes = new Uint8Array(await blob.slice(start, end).arrayBuffer());
        let binary = "";
        for (let i=0; i<bytes.length; i+=0x8000) binary += String.fromCharCode(...bytes.subarray(i, i+0x8000));
        sendResponse({ok:true,offset:start,end,base64:btoa(binary)});
    })().catch(error => sendResponse({ok:false,error:error.message || String(error)}));
    return true;
});
