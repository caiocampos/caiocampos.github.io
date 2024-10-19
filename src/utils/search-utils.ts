import { RepositoryWordDictionary } from "./repository-utils";
import { splitString } from "./string-utils";

export const filterResult = (
  text: string,
  wordDictionary: RepositoryWordDictionary
): number[] | undefined => {
  if (text.trim() === "") {
    return undefined;
  } else {
    const itensFound = splitString(text).map((part) => {
      const result: number[] = [];
      for (const item of wordDictionary) {
        if (item.key.includes(part)) {
          result.push(...item.values);
        }
      }
      return result;
    });
    if (itensFound.length === 1) {
      return itensFound[0];
    } else {
      const [first, ...rest] = itensFound.sort((a, b) => a.length - b.length);
      const newFilter = [...first];
      for (const item of rest) {
        const elements = [...newFilter];
        for (const element of elements) {
          if (!item.includes(element)) {
            const index = newFilter.indexOf(element);
            if (index > -1) {
              newFilter.splice(index, 1);
            }
            if (newFilter.length === 0) {
              return [];
            }
          }
        }
      }
      return newFilter;
    }
  }
};
