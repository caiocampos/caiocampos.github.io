import { MinimalRepository, PublicUser } from "./github-dtos";

type RepoSort = "created" | "updated" | "pushed" | "full_name";
type RepoSortDirection = "asc" | "desc";
type RepoType = "all" | "owner" | "member";

export class GithubServices {
  private static userRepos: Promise<MinimalRepository[]> | null = null;

  public static async getUser(userLogin: string): Promise<PublicUser> {
    const url = `https://api.github.com/users/${userLogin}`;
    const res: Response = await fetch(url);
    const repositories: PublicUser = await res.json();
    return repositories;
  }

  public static async getUserRepos(
    userLogin: string,
    per_page?: number,
    page?: number,
    sort: RepoSort = "updated",
    direction?: RepoSortDirection,
    type?: RepoType
  ): Promise<MinimalRepository[]> {
    let url = `https://api.github.com/users/${userLogin}/repos?sort=${sort}`;
    if (direction) {
      url += `&direction=${direction}`;
    }
    if (per_page) {
      url += `&per_page=${per_page}`;
    }
    if (page) {
      url += `&page=${page}`;
    }
    if (type) {
      url += `&type=${type}`;
    }
    const res: Response = await fetch(url);
    const repositories: MinimalRepository[] = await res.json();
    return repositories;
  }

  public static async getAllUserRepos(
    userLogin: string,
    sort: RepoSort = "updated",
    direction?: RepoSortDirection,
    type?: RepoType
  ): Promise<MinimalRepository[]> {
    const { public_repos } = await GithubServices.getUser(userLogin);

    const pageSize = 10;
    const timesWillCall = Math.ceil(public_repos / pageSize);
    const promises = Array.from({ length: timesWillCall }, (_, i) =>
      GithubServices.getUserRepos(
        userLogin,
        pageSize,
        i + 1,
        sort,
        direction,
        type
      )
    );
    return (await Promise.all(promises)).flatMap((result) => result);
  }

  public static async getCachedAllUserRepos(
    userLogin: string,
    sort: RepoSort = "updated",
    direction?: RepoSortDirection,
    type?: RepoType
  ): Promise<MinimalRepository[]> {
    if (GithubServices.userRepos === null) {
      GithubServices.userRepos = GithubServices.getAllUserRepos(
        userLogin,
        sort,
        direction,
        type
      );
    }
    return GithubServices.userRepos;
  }
}
