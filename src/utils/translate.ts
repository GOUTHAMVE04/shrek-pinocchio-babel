export type LanguageMode = "auto" | "en" | "ml";

// Simple Malayalam detection by Unicode range
export function detectLang(text: string): "en" | "ml" {
  const hasMalayalam = /[\u0D00-\u0D7F]/.test(text);
  return hasMalayalam ? "ml" : "en";
}

// LibreTranslate public endpoint fallback (no key). CORS and rate limits may apply.
const LIBRE_ENDPOINTS = [
  "https://libretranslate.de/translate",
  "https://translate.astian.org/translate",
];

interface TranslateOptions {
  source?: "en" | "ml";
  target: "en" | "ml";
}

export async function translate(text: string, opts: TranslateOptions): Promise<string> {
  const payload = (endpoint: string) =>
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: opts.source ?? "auto",
        target: opts.target,
        format: "text",
      }),
    }).then(async (r) => {
      if (!r.ok) throw new Error("translate_failed");
      const data = (await r.json()) as { translatedText?: string };
      if (!data.translatedText) throw new Error("translate_bad_payload");
      return data.translatedText;
    });

  for (const ep of LIBRE_ENDPOINTS) {
    try {
      return await payload(ep);
    } catch (_) {
      // try next
    }
  }
  return text; // graceful fallback
}
