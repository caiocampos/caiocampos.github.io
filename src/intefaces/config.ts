export interface ConfigurationData extends Configuration {
  languages: LanguageData[];
}

export interface Configuration {
  title: string;
  user_name: string;
  user_login: string;
  user_id: number;
  orgs_login?: string[] | null;
}

export interface LanguageData {
  name: string;
  image: string;
  link: string;
}
