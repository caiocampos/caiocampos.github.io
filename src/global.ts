import { ConfigurationData, LanguageData } from "./intefaces/config";
import Config from "./config.json";
import { TermTranslation } from "./intefaces/translation";

export const configguration: ConfigurationData = Config;

export const languageDictionary = configguration.languages.reduce(
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
};
