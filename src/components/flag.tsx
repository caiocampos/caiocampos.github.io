import { flags, Language } from "@/utils/language-utils";

interface FlagProps {
  language: Language;
}

export const Flag = ({ language }: FlagProps): JSX.Element => {
  return <span className={`fi fi-${flags[language]}`}></span>;
};
