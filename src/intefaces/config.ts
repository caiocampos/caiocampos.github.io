export interface ConfigurationData {
  title: string;
  user_name: string;
  user_login: string;
  user_id: number;
  languages: LanguageData[];
}

export interface LanguageData {
  name: string;
  image: string;
  link: string;
}
