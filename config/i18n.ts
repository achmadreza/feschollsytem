// config/i18n.ts

export type LanguageCode = "en" | "id";

export const languages: { code: LanguageCode; label: string; flag?: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
];

type Dictionary = Record<string, string>;

const en: Dictionary = {
  "app.title": "School Management",
  "footer.text": "Copyright @ {year} All rights Reserved",
};

const id: Dictionary = {
  "app.title": "School Management",
  "footer.text": "Copyright @ {year}, All rights Reserved",
};

export const dictionaries: Record<LanguageCode, Dictionary> = { en, id };

export function translate(lang: LanguageCode, key: string): string {
  const dict = dictionaries[lang] ?? dictionaries.en;
  return dict[key] ?? dictionaries.en[key] ?? key;
}
