export interface TermTranslation {
  archived: string;
  page: string;
  search: string;
  source: string;
  autotranslated: string;
  other: string;
  toggleTheme: string;
  light: string;
  dark: string;
  system: string;
}

export interface TermTranslationAdapter {
  termTranslation: TermTranslation;
}
