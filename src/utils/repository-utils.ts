import { RepositoryData } from "@/intefaces/repository-data";
import { MinimalRepository } from "@/services/github/github-dtos";
import { splitString } from "./string-utils";

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
  };
};

export type RepositoryWordDictionary = RepositoryWordDictionaryItem[];

export interface RepositoryWordDictionaryItem {
  key: string;
  values: number[];
}

export const createRepositoryWordDictionary = (
  bruteData: MinimalRepository[]
): RepositoryWordDictionary => {
  const dictionary: Record<string, Set<number>> = {};
  bruteData.forEach(({ id, name, description, language, archived, fork }) => {
    if (fork) {
      dictionary["fork"] = updateSet(dictionary["fork"], id);
    }
    if (archived) {
      dictionary["arquivado"] = updateSet(dictionary["arquivado"], id);
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
