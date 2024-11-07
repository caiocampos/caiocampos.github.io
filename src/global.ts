import { Configuration, LanguageData } from "./intefaces/config";
import Config from "./config.json";
import Languages from "./languages.json";
import { TermTranslation } from "./intefaces/translation";

const languages: LanguageData[] = Languages;

export const configuration: Configuration = Config;

export const languageDictionary = languages.reduce(
  (accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue;
    return accumulator;
  },
  {} as Record<string, LanguageData>
);

export const termTranslationPT: TermTranslation = {
  archived: "arquivado",
  page: "Página do projeto",
  search: "Buscar por termo",
  source: "Código fonte",
  autotranslated: "Traduzido automaticamente por inteligência artificial",
  other: "Outras",
  toggleTheme: "Mudar o tema",
  light: "Claro",
  dark: "Escuro",
  system: "Tema do sistema",
};

export const termTranslationPTForTranslation: TermTranslation = {
  ...termTranslationPT,
  light: "Brilhante",
  system: "Automático"
};
