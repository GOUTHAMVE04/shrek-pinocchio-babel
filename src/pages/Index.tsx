import Header from "@/components/Header";
import ControlsPanel from "@/components/ControlsPanel";
import ChatPanel, { type Message } from "@/components/ChatPanel";
import StatusBar from "@/components/StatusBar";
import { applyPinocchioConfusion, type ConfusionLevel } from "@/utils/pinocchio";
import { detectLang, translate, type LanguageMode } from "@/utils/translate";
import { canRecognizeSpeech, speak, startRecognition } from "@/utils/speech";
import { toast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";

function useMouseGradient() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mx", `${(e.clientX / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty("--my", `${(e.clientY / window.innerHeight) * 100}%`);
    };
    window.addEventListener("pointermove", handler, { passive: true });
    return () => window.removeEventListener("pointermove", handler);
  }, []);
}

const Index = () => {
  useMouseGradient();

  const [messages, setMessages] = useState<Message[]>([]);
  const [confusion, setConfusion] = useState<ConfusionLevel>("shrek3");
  const [languageMode, setLanguageMode] = useState<LanguageMode>("auto");
  const [rate, setRate] = useState(1);
  const [status, setStatus] = useState("Ready");
  const [micActive, setMicActive] = useState(false);
  const stopRef = useRef<null | (() => void)>(null);
  const lastResponseRef = useRef("");

  const addMsg = (m: Omit<Message, "id" | "ts">) =>
    setMessages((prev) => [...prev, { ...m, id: crypto.randomUUID(), ts: Date.now() }]);

  const processText = async (text: string) => {
    setStatus("Processing…");

    // Language resolving
    const inputLang = languageMode === "auto" ? detectLang(text) : languageMode;

    let toEnglish = text;
    if (inputLang === "ml") {
      toEnglish = await translate(text, { target: "en", source: "ml" });
    }

    const confused = applyPinocchioConfusion(toEnglish, confusion);

    let finalText = confused;
    if (inputLang === "ml") {
      finalText = await translate(confused, { target: "ml", source: "en" });
    }

    addMsg({ role: "user", text });
    addMsg({ role: "pinocchio", text: finalText });
    lastResponseRef.current = finalText;

    setStatus("Done");
    speak(finalText, rate, inputLang);
  };

  const onMic = () => {
    if (micActive) {
      stopRef.current?.();
      setMicActive(false);
      setStatus("Mic stopped");
      return;
    }
    if (!canRecognizeSpeech()) {
      toast({ title: "Speech recognition not supported", description: "Try Chrome on desktop." });
      return;
    }
    setStatus("Listening…");
    setMicActive(true);
    stopRef.current = startRecognition({
      lang: languageMode === "auto" ? undefined : (languageMode as any),
      onResult: (t) => {
        setMicActive(false);
        setStatus("Transcribing done");
        processText(t);
      },
      onEnd: () => {
        setMicActive(false);
        setStatus("Mic idle");
      },
      onError: () => {
        setMicActive(false);
        setStatus("Mic error");
      },
    });
  };

  const onSpeak = () => {
    if (!lastResponseRef.current) return;
    const lang = languageMode === "auto" ? detectLang(lastResponseRef.current) : languageMode;
    speak(lastResponseRef.current, rate, lang);
  };

  const onClear = () => setMessages([]);

  const onSave = () => {
    const text = messages
      .map((m) => `${m.role === "user" ? "You" : "Pinocchio"} @ ${new Date(m.ts).toLocaleString()}:\n${m.text}\n`)
      .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pinocchio-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    document.title = "Pinocchio Voice Translator — Shrek 3 Style";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ControlsPanel
        confusion={confusion}
        onConfusion={setConfusion}
        languageMode={languageMode}
        onLanguageMode={setLanguageMode}
        rate={rate}
        onRate={setRate}
        onMic={onMic}
        onSpeak={onSpeak}
        onClear={onClear}
        onSave={onSave}
        micActive={micActive}
      />
      <ChatPanel messages={messages} onSend={processText} disabledUpload={true} />
      <StatusBar status={status} />

      <section id="how-it-works" className="container mx-auto px-4 mt-10 mb-16">
        <h2 className="text-xl font-semibold mb-2">How it works</h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          This client-side demo uses your browser for speech recognition and speech synthesis. Malayalam/English translation
          uses a public endpoint as a fallback; results may vary. Audio file transcription will be enabled once a backend key is configured.
        </p>
      </section>
    </div>
  );
};

export default Index;
