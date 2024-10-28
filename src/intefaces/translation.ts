export interface TermTranslation {
  archived: string;
  page: string;
  search: string;
  source: string;
  autotranslated: string
}

export interface TermTranslationAdapter {
  termTranslation: TermTranslation;
}
