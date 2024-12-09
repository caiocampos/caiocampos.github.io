import { JSX } from "react";
import { LanguageData } from "@/intefaces/config";

export const LanguageBadge = (language: LanguageData): JSX.Element => {
  return (
    <a href={language.link}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={language.image} alt={language.name} title={language.name} />
    </a>
  );
};
