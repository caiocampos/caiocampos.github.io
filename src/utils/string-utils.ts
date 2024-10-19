export const splitString = (text: string): string[] => {
  const regexSpecial = /([\-;,.:\(\)\/\\@\'\"]|\s)+/g;
  const regexSpaces = /\s/g;
  return text
    .toLowerCase()
    .replace(regexSpecial, " ")
    .split(regexSpaces)
    .filter((value: string) => value !== "")
    .map((value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
};
