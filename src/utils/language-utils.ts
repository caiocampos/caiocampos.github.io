import { termTranslationPT, termTranslationPTForTranslation } from "@/global";
import { TermTranslation } from "@/intefaces/translation";
import { MinimalRepository } from "@/services/github/github-dtos";
import { LibretranslateServices } from "@/services/libretranslate/libretranslate-services";
import { regexLink } from "./string-utils";
import { Language, LanguageEnum } from "@/types/languages";

const isFullBuild = (): boolean =>
  process.env.NEXT_PUBLIC_FULL_BUILD === "true";

export const languages: Language[] = isFullBuild()
  ? ["pt", "en", "es", "it", "fr", "de"]
  : ["pt"];

export const defaultLanguage = (): Language => (isFullBuild() ? "en" : "pt");

const PT = LanguageEnum.Portuguese;

export const locales = {
  pt: "pt-BR",
  en: "en-US",
  es: "es",
  it: "it",
  fr: "fr",
  de: "de",
};

export const flags = {
  pt: "br",
  en: "us",
  es: "es",
  it: "it",
  fr: "fr",
  de: "de",
};

export const languageName = {
  pt: "Português",
  en: "English",
  es: "Español",
  it: "Italiano",
  fr: "Français",
  de: "Deutsch",
};

export const isLanguagePT = (language: Language) => language === PT;

export const getLanguageDisclaimer = (
  language: Language,
  termTranslation: TermTranslation,
) => {
  if (isLanguagePT(language)) {
    return languageName.pt;
  }
  return `${languageName[language]} - ${termTranslation.autotranslated}`;
};

export interface PageParams {
  language: Language;
}

export const generateParams = (langs: Language[]): PageParams[] =>
  langs.map((language) => ({
    language,
  }));

const keys: (keyof TermTranslation)[] = [
  "archived",
  "page",
  "search",
  "source",
  "autotranslated",
  "other",
  "toggleLanguage",
  "toggleTheme",
  "light",
  "dark",
  "system",
];

const defaultPageSize = 2;

export const getTermTranslation = async (
  language: Language,
  pageSize = defaultPageSize,
): Promise<TermTranslation> => {
  if (isLanguagePT(language)) {
    return termTranslationPT;
  }
  const base = [...keys];
  const out: TermTranslation = { ...termTranslationPT };
  while (base.length > 0) {
    const page = base.splice(0, pageSize);
    const promises = page.map(async (key) => ({
      key,
      value: await LibretranslateServices.translate(
        termTranslationPTForTranslation[key],
        PT,
        language,
      ),
    }));
    const translatedPage = await Promise.all(promises);
    translatedPage.forEach(({ key, value }) => {
      out[key] = value;
    });
  }
  return out;
};

export const getDescriptionTranslation = async (
  description: string,
  language: Language,
): Promise<string> => {
  if (isLanguagePT(language)) {
    return description;
  }
  const [originalDescription, ...linkParts] = description.split(regexLink);
  const translatedDescription = await LibretranslateServices.translate(
    originalDescription,
    PT,
    language,
  );
  return linkParts.length > 0
    ? [translatedDescription, " ", ...linkParts].join("")
    : translatedDescription;
};

export const getRepositoryTranslation = async (
  repository: MinimalRepository,
  language: Language,
): Promise<MinimalRepository> => {
  if (isLanguagePT(language) || repository.description === null) {
    return repository;
  }
  const description = await getDescriptionTranslation(
    repository.description,
    language,
  );
  return { ...repository, description };
};

export const getRepositoriesTranslation = async (
  repositories: MinimalRepository[],
  language: Language,
  pageSize = defaultPageSize,
): Promise<MinimalRepository[]> => {
  const base = [...repositories];
  if (isLanguagePT(language)) {
    return base;
  }
  const out: MinimalRepository[] = [];
  while (base.length > 0) {
    const page = base.splice(0, pageSize);
    const translatedPage = await Promise.all(
      page.map((repository) => getRepositoryTranslation(repository, language)),
    );
    out.push(...translatedPage);
  }
  return out;
};
