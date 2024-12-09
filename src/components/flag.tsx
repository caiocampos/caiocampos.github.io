import { JSX } from "react";
import { flags, Language } from "@/utils/language-utils";

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
