import { JSX } from "react";
import { flags } from "@/utils/language-utils";
import { Language } from "@/types/languages";

interface FlagProps {
  language: Language;
}

export const Flag = ({ language }: FlagProps): JSX.Element => {
  return (
    <span
      className={`flag fi fi-${flags[language]} border border-black`}
    ></span>
  );
};
