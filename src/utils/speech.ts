export function speak(text: string, rate = 1, lang: "en" | "ml" = "en") {
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = rate;
  utter.lang = lang === "ml" ? "ml-IN" : "en-US";
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) =>
    lang === "ml" ? v.lang.toLowerCase().includes("ml") : v.lang.toLowerCase().startsWith("en")
  );
  if (preferred) utter.voice = preferred;
  window.speechSynthesis.cancel(); // reset queue
  window.speechSynthesis.speak(utter);
}

export function canRecognizeSpeech() {
  return typeof (window as any).webkitSpeechRecognition !== "undefined";
}

export function startRecognition(
  opts: { lang?: "en" | "ml"; onResult: (text: string) => void; onEnd?: () => void; onError?: (e: any) => void }
) {
  const Rec: any = (window as any).webkitSpeechRecognition;
  const rec = new Rec();
  rec.lang = opts.lang === "ml" ? "ml-IN" : "en-US";
  rec.continuous = false;
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  rec.onresult = (e: any) => {
    const transcript = e.results?.[0]?.[0]?.transcript ?? "";
    if (transcript) opts.onResult(transcript);
  };
  rec.onerror = (e: any) => opts.onError?.(e);
  rec.onend = () => opts.onEnd?.();
  rec.start();
  return () => rec.abort();
}
