import { RepositoryData } from "@/intefaces/repository-data";
import { splitString } from "./string-utils";

export const parseRepositoryData = <T extends RepositoryData>(
  bruteData: T
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
    language,
    homepage,
    archived,
    fork,
  };
};

export type RepositoryWordDictionary = RepositoryWordDictionaryItem[];

export interface RepositoryWordDictionaryItem {
  key: string;
  values: number[];
}

export const createRepositoryWordDictionary = <T extends RepositoryData>(
  bruteData: T[]
): RepositoryWordDictionary => {
  const dictionary: Record<string, Set<number>> = {};
  bruteData.forEach(({ id, name, description, language, archived, fork }) => {
    if (fork) {
      dictionary["fork"] = updateSet(dictionary["fork"], id);
    }
    if (archived) {
      dictionary["arquivado"] = updateSet(dictionary["arquivado"], id);
    }
    if (language !== null) {
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