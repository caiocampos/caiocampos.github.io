import { termTranslationPT } from "@/global";
import { TermTranslation } from "@/intefaces/translation";
import { MinimalRepository } from "@/services/github/github-dtos";
import { LibretranslateServices } from "@/services/libretranslate/libretranslate-services";
import { regexLink } from "./string-utils";

export type Language = "pt" | "en" | "es" | "it" | "fr" | "de";

export const languages: Language[] = ["pt", "en", "es", "it", "fr", "de"];

export enum LanguageEnum {
  Portuguese = "pt",
  English = "en",
  Spanish = "es",
  Italian = "it",
  French = "fr",
  German = "de",
}

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
  termTranslation: TermTranslation
) => {
  if (isLanguagePT(language)) {
    return languageName.pt;
  }
  return `${languageName[language]} - ${termTranslation.autotranslated}`;
};

export interface PageParams {
  language: Language;
}

export interface PageProps {
  params: PageParams;
}

export const generateParams = (): PageParams[] =>
  languages.map((language) => ({
    language,
  }));

export const getTermTranslation = async (
  language: Language
): Promise<TermTranslation> => {
  if (isLanguagePT(language)) {
    return termTranslationPT;
  }
  const archivedPromise = LibretranslateServices.translate(
    termTranslationPT.archived,
    PT,
    language
  );
  const pagePromise = LibretranslateServices.translate(
    termTranslationPT.page,
    PT,
    language
  );
  const searchPromise = LibretranslateServices.translate(
    termTranslationPT.search,
    PT,
    language
  );
  const sourcePromise = LibretranslateServices.translate(
    termTranslationPT.source,
    PT,
    language
  );
  const autotranslatedPromise = LibretranslateServices.translate(
    termTranslationPT.autotranslated,
    PT,
    language
  );

  const [archived, page, search, source, autotranslated] = await Promise.all([
    archivedPromise,
    pagePromise,
    searchPromise,
    sourcePromise,
    autotranslatedPromise,
  ]);
  return { archived, page, search, source, autotranslated };
};

export const getRepositoryTranslation = async (
  repository: MinimalRepository,
  language: Language
): Promise<MinimalRepository> => {
  const base = { ...repository };
  if (isLanguagePT(language) || base.description === null) {
    return base;
  }
  const [originalDescription, ...linkParts] = base.description.split(regexLink);
  const description = await LibretranslateServices.translate(
    originalDescription,
    PT,
    language
  );
  base.description = [description, " ", ...linkParts].join("");
  return base;
};

export const getRepositoriesTranslation = async (
  repositories: MinimalRepository[],
  language: Language,
  pageSize = 3
): Promise<MinimalRepository[]> => {
  const base = [...repositories];
  if (isLanguagePT(language)) {
    return base;
  }
  const out: MinimalRepository[] = [];
  while (base.length > 0) {
    const page = base.splice(0, pageSize);
    const translatedPage = await Promise.all(
      page.map((repository) => getRepositoryTranslation(repository, language))
    );
    out.push(...translatedPage);
  }
  return out;
};
