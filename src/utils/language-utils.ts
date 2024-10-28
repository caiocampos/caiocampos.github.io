import { termTranslationPT } from "@/global";
import { TermTranslation } from "@/intefaces/translation";
import { MinimalRepository } from "@/services/github/github-dtos";
import { LibretranslateServices } from "@/services/libretranslate/libretranslate-services";

export type Language = "pt" | "en" | "es" | "it" | "fr" | "de";

export const languages: Language[] = ["pt", "en", "es", "it", "fr", "de"];

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

export const getLanguageDisclaimer = (
  language: Language,
  termTranslation: TermTranslation
) => {
  if (language === "pt") {
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
  if (language === "pt") {
    return termTranslationPT;
  }
  const archivedPromise = LibretranslateServices.translate(
    termTranslationPT.archived,
    "pt",
    language
  );
  const pagePromise = LibretranslateServices.translate(
    termTranslationPT.page,
    "pt",
    language
  );
  const searchPromise = LibretranslateServices.translate(
    termTranslationPT.search,
    "pt",
    language
  );
  const sourcePromise = LibretranslateServices.translate(
    termTranslationPT.source,
    "pt",
    language
  );
  const autotranslatedPromise = LibretranslateServices.translate(
    termTranslationPT.autotranslated,
    "pt",
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
  if (language === "pt" || repository.description === null) {
    return repository;
  }
  const description = await LibretranslateServices.translate(
    repository.description,
    "pt",
    language
  );
  repository.description = description;
  return repository;
};

export const getRepositoriesTranslation = async (
  repositories: MinimalRepository[],
  language: Language,
  pageSize = 5
): Promise<MinimalRepository[]> => {
  if (language === "pt") {
    return repositories;
  }
  const out: MinimalRepository[] = [];
  while (repositories.length > 0) {
    const page = repositories.splice(0, pageSize);
    const translatedPage = await Promise.all(
      page.map((repository) => getRepositoryTranslation(repository, language))
    );
    out.push(...translatedPage);
  }
  return out;
};
