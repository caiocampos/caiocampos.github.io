export interface Configuration {
  title: string;
  user_name: string;
  user_login: string;
  user_id: number;
  orgs_login?: string[] | null;
  main_color: string;
  search_color: string;
  min_language_count?: number;
  group_languages?: boolean;
  language_family_config?: Record<string, string>;
  json_generator?: JsonGenerator | null;
}

export interface LanguageData {
  name: string;
  image: string;
  link: string;
}

export interface JsonGenerator {
  source_language: string;
  target_languages: string[];
  max_size: number;
  partial_output_path: string;
  final_output_path: string;
}
