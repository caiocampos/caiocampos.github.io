import { ConfigurationData, LanguageData } from "./intefaces/config";
import Config from "./config.json";

export const configguration: ConfigurationData = Config;

export const languageDictionary = configguration.languages.reduce(
  (accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue;
    return accumulator;
  },
  {} as Record<string, LanguageData>
);
