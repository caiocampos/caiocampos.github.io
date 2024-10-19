import { RepositoryData } from "@/intefaces/repository-data";

export class GithubServices {
  public static async getUserRepos(
    userLogin: string,
    sort = "updated"
  ): Promise<RepositoryData[]> {
    const res: Response = await fetch(
      `https://api.github.com/users/${userLogin}/repos?sort=${sort}`
    );
    const repositories: RepositoryData[] = await res.json();
    return repositories;
  }
}
