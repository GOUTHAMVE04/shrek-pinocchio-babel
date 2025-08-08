export type ConfusionLevel = "mild" | "medium" | "maximum" | "shrek3";

const DICTS = {
  mild: {
    phone: "device",
    good: "nice",
    bad: "poor",
    big: "large",
    small: "tiny",
    happy: "joyful",
  },
  medium: {
    phone: "telecommunications device",
    car: "vehicle",
    house: "dwelling",
    good: "excellent",
    bad: "suboptimal",
    person: "individual",
    thing: "object",
    happy: "ecstatic",
  },
  maximum: {
    phone: "telecommunications apparatus",
    car: "motorized transportation vehicle",
    house: "residential architectural structure",
    person: "individual human entity",
    thing: "aforementioned object or concept",
    good: "exemplary and satisfactory",
    bad: "suboptimal and unsatisfactory",
    happy: "profoundly jubilant",
  },
} as const;

const SHREK_TEMPLATES = {
  where: (subject: string) =>
    `Well, I don't know where ${subject} is, but I do know where ${subject} is not, which is precisely somewhere between the place it could be and the place it definitely isn't, if you catch my drift...`,
  who: (subject: string) =>
    `Who is ${subject}? Now, that depends on whether we're talking about who ${subject} is currently being, or who ${subject} is being perceived as being—by those who think they know who ${subject} is.`,
  what: (subject: string) =>
    `What do I know about ${subject}? Not much... or maybe quite a bit—depending on your definition of "know" and whether "about" includes things adjacent to ${subject}.`,
  tell: (subject: string) =>
    `Tell you about ${subject}? I could, but then I'd have to also tell you about the things I'm not telling you about ${subject}, which may or may not be the same thing.`,
};

function replaceWithDict(text: string, dict: Record<string, string>) {
  const pattern = new RegExp(`\\b(${Object.keys(dict).join("|")})\\b`, "gi");
  return text.replace(pattern, (m) => {
    const key = m.toLowerCase();
    const replacement = dict[key];
    // Preserve capitalization
    if (!replacement) return m;
    if (m[0] === m[0].toUpperCase()) {
      return replacement[0].toUpperCase() + replacement.slice(1);
    }
    return replacement;
  });
}

function extractSubjectFor(question: string) {
  const lowered = question.toLowerCase();
  // naive extraction
  const words = lowered.split(/\s+/);
  const whIndex = words.findIndex((w) => ["where", "who", "what", "tell"].includes(w));
  if (whIndex >= 0) {
    const subject = words.slice(whIndex + 1).join(" ").replace(/[?!.]+$/, "").trim();
    return subject || "that";
  }
  return "that";
}

export function applyPinocchioConfusion(text: string, level: ConfusionLevel): string {
  if (!text?.trim()) return "";
  if (level === "shrek3") {
    const lowered = text.toLowerCase();
    if (lowered.startsWith("where")) return SHREK_TEMPLATES.where(extractSubjectFor(text));
    if (lowered.startsWith("who")) return SHREK_TEMPLATES.who(extractSubjectFor(text));
    if (lowered.startsWith("what")) return SHREK_TEMPLATES.what(extractSubjectFor(text));
    if (lowered.startsWith("tell")) return SHREK_TEMPLATES.tell(extractSubjectFor(text));
    // default evasive response
    return `Well, it's not that I don't know, it's just that knowing and saying are two very different things, especially when ${extractSubjectFor(text)} is involved.`;
  }

  const dict = DICTS[level];
  return replaceWithDict(text, dict);
}
