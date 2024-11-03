export const regexDot = /([.:;!?])\s+/g;
export const dots = [".", ":", ";", "!", "?"];
export const regexLink = /(http[s]?:\/\/[.a-z0-9@/-]+)/gi;
export const regexSpecial = /([\-;,.:\(\)\/\\@\'\"]|\s)+/g;
export const regexSpaces = /\s/g;

export const splitString = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(regexSpecial, " ")
    .split(regexSpaces)
    .filter((value: string) => value !== "")
    .map((value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
};
