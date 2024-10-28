import { RepositoryData } from "@/intefaces/repository-data";
import { MinimalRepository } from "@/services/github/github-dtos";
import { splitString } from "./string-utils";
import { TermTranslation } from "@/intefaces/translation";

export const parseRepositoryData = (
  bruteData: MinimalRepository
): RepositoryData => {
  const {
    id,
    name,
    html_url,
    description,
    language,
    homepage,
    archived,
    fork,
    forks_count,
    stargazers_count,
  } = bruteData;
  return {
    id,
    name,
    html_url,
    description,
    language: language ?? null,
    homepage: homepage ?? null,
    archived: archived ?? false,
    fork,
    forks_count: forks_count ?? 0,
    stargazers_count: stargazers_count ?? 0,
  };
};

export type RepositoryWordDictionary = RepositoryWordDictionaryItem[];

export interface RepositoryWordDictionaryItem {
  key: string;
  values: number[];
}

export const createRepositoryWordDictionary = (
  bruteData: MinimalRepository[],
  termTranslation: TermTranslation
): RepositoryWordDictionary => {
  const dictionary: Record<string, Set<number>> = {};
  bruteData.forEach(({ id, name, description, language, archived, fork }) => {
    if (fork) {
      dictionary["fork"] = updateSet(dictionary["fork"], id);
    }
    if (archived) {
      dictionary[termTranslation.archived] = updateSet(dictionary[termTranslation.archived], id);
    }
    if (language !== null && language !== undefined) {
      const word = language.toLowerCase();
      dictionary[word] = updateSet(dictionary[word], id);
    }
    if (description !== null) {
      splitString(description).forEach(
        (word) => (dictionary[word] = updateSet(dictionary[word], id))
      );
    }
    splitString(name).forEach(
      (word) => (dictionary[word] = updateSet(dictionary[word], id))
    );
  });
  return Object.entries(dictionary).map(([key, idsSet]) => ({
    key,
    values: Array.from(idsSet),
  }));
};

const updateSet = (
  wordSet: Set<number> | undefined,
  value: number
): Set<number> => {
  if (wordSet === undefined) {
    wordSet = new Set<number>();
  }
  wordSet.add(value);
  return wordSet;
};

export const repositoryComparison = (
  a: MinimalRepository,
  b: MinimalRepository
): number => {
  const stargazersComparison =
    (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0);
  if (stargazersComparison !== 0) {
    return stargazersComparison;
  }
  const forksComparison = (b.forks_count ?? 0) - (a.forks_count ?? 0);
  if (forksComparison !== 0) {
    return forksComparison;
  }
  return (
    new Date(b.updated_at ?? 0).getTime() -
    new Date(a.updated_at ?? 0).getTime()
  );
};
