export interface Configuration {
  title: string;
  user_name: string;
  user_login: string;
  user_id: number;
  orgs_login?: string[] | null;
  main_color: string;
  search_color: string;
}

export interface LanguageData {
  name: string;
  image: string;
  link: string;
}
