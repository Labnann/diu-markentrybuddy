(() => {
    if (window.__MEH_VOSK_BRIDGE__) return;
    window.__MEH_VOSK_BRIDGE__ = true;
    let model = null, recognizer = null, stream = null, context = null, processor = null, source = null;
    const send = (type, fields = {}) => window.postMessage({source:"MEH_VOSK", type, ...fields}, "*");
    async function stop() {
        try { processor?.disconnect(); } catch (_) {}
        try { source?.disconnect(); } catch (_) {}
        try { recognizer?.remove(); } catch (_) {}
        try { model?.terminate(); } catch (_) {}
        try { stream?.getTracks().forEach(t => t.stop()); } catch (_) {}
        try { await context?.close(); } catch (_) {}
        model = recognizer = stream = context = processor = source = null;
    }
    async function start(modelUrl) {
        await stop();
        try {
            if (!window.Vosk) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement("script");
                    script.src = "https://cdn.jsdelivr.net/npm/vosk-browser@0.0.7/dist/vosk.js";
                    script.onload = resolve;
                    script.onerror = () => reject(new Error("Unable to load vosk-browser library"));
                    (document.head || document.documentElement).appendChild(script);
                });
            }
            model = await window.Vosk.createModel(modelUrl);
            stream = await navigator.mediaDevices.getUserMedia({video:false,audio:{echoCancellation:true,noiseSuppression:true,channelCount:1}});
            context = new AudioContext();
            source = context.createMediaStreamSource(stream);
            processor = context.createScriptProcessor(4096,1,1);
            recognizer = new model.KaldiRecognizer();
            recognizer.on("result", msg => { const text = msg?.result?.text || ""; if (text) send("RESULT", {text}); });
            recognizer.on("partialresult", msg => { const text = msg?.result?.partial || ""; if (text) send("STATUS", {message:`Listening: ${text}`}); });
            processor.onaudioprocess = e => { try { recognizer.acceptWaveform(e.inputBuffer); } catch (err) { console.error(err); } };
            source.connect(processor); processor.connect(context.destination);
            send("STATUS", {message:"Vosk is listening. Speak the ID suffix, pause, then the mark."});
        } catch (e) { send("ERROR", {message:e?.message || String(e)}); await stop(); }
    }
    window.addEventListener("message", event => {
        if (event.source !== window || event.data?.source !== "MEH_CONTENT") return;
        if (event.data.type === "START_VOSK") start(event.data.modelUrl);
        if (event.data.type === "STOP_VOSK") stop();
    });
})();
