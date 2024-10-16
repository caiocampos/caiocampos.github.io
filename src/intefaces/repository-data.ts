export interface RepositoryData extends RepositoryDataBase {
  id: number;
}

export interface RepositoryDataBase {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  homepage: string | null;
  archived: boolean;
  fork: boolean;
}
