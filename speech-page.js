(() => {
    if (window.__MEH_VOSK_BRIDGE__) return;
    window.__MEH_VOSK_BRIDGE__ = true;
    let model = null, recognizer = null, stream = null, context = null, processor = null, source = null, mute = null;
    const send = (type, fields = {}) => window.postMessage({source:"MEH_VOSK", type, ...fields}, "*");
    async function stop() {
        try { processor?.disconnect(); } catch (_) {}
        try { source?.disconnect(); } catch (_) {}
        try { mute?.disconnect(); } catch (_) {}
        try { recognizer?.remove(); } catch (_) {}
        try { model?.terminate(); } catch (_) {}
        try { stream?.getTracks().forEach(t => t.stop()); } catch (_) {}
        try { await context?.close(); } catch (_) {}
        model = recognizer = stream = context = processor = source = mute = null;
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
            stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 }
            });
            context = new AudioContext();
            await context.resume();
            const grammar = JSON.stringify([
                "zero", "oh", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
                "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen",
                "eighteen", "nineteen", "twenty", "thirty", "forty", "fifty", "sixty", "seventy",
                "eighty", "ninety", "hundred", "thousand", "million", "billion", "point"
            ]);
            recognizer = new model.KaldiRecognizer(context.sampleRate, grammar);
            recognizer.on("result", event => {
                const text = event?.result?.text || "";
                if (text) send("RESULT", {text});
            });
            recognizer.on("partialresult", event => {
                const text = event?.result?.partial || "";
                if (text) send("STATUS", {message:`Listening for numbers: ${text}`});
            });
            source = context.createMediaStreamSource(stream);
            processor = context.createScriptProcessor(4096, 1, 1);
            mute = context.createGain();
            mute.gain.value = 0;
            processor.onaudioprocess = event => {
                try { recognizer.acceptWaveform(event.inputBuffer); } catch (error) { console.error(error); }
            };
            source.connect(processor);
            processor.connect(mute);
            mute.connect(context.destination);
            send("STATUS", {message:"Speech entry is working. Speak the student ID, pause, then the mark."});
        } catch (error) {
            send("ERROR", {message:error?.message || String(error)});
            await stop();
        }
    }

    window.addEventListener("message", event => {
        if (event.source !== window || event.data?.source !== "MEH_CONTENT") return;
        if (event.data.type === "START_VOSK") start(event.data.modelUrl);
        if (event.data.type === "STOP_VOSK") stop();
    });
})();
