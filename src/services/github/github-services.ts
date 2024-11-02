import { MinimalRepository, OrganizationFull, PublicUser } from "./github-dtos";

type RepoSort = "created" | "updated" | "pushed" | "full_name";
type RepoSortDirection = "asc" | "desc";
type RepoType = "all" | "owner" | "member";

export class GithubServices {
  private static userRepos: Promise<MinimalRepository[]> | null = null;
  private static orgsRepos: Promise<MinimalRepository[]> | null = null;

  public static async getUser(login: string): Promise<PublicUser> {
    const url = `https://api.github.com/users/${login}`;
    const res: Response = await fetch(url);
    const repositories: PublicUser = await res.json();
    return repositories;
  }

  public static async getOrg(login: string): Promise<OrganizationFull> {
    const url = `https://api.github.com/orgs/${login}`;
    const res: Response = await fetch(url);
    const repositories: OrganizationFull = await res.json();
    return repositories;
  }

  public static async getUserRepos(
    login: string,
    per_page?: number,
    page?: number,
    sort: RepoSort = "updated",
    direction?: RepoSortDirection,
    type?: RepoType
  ): Promise<MinimalRepository[]> {
    const url = GithubServices.makeRepoURL(
      "users",
      login,
      per_page,
      page,
      sort,
      direction,
      type
    );
    const res: Response = await fetch(url);
    const repositories: MinimalRepository[] = await res.json();
    return repositories;
  }

  public static async getAllUserRepos(
    login: string,
    sort: RepoSort = "updated",
    direction?: RepoSortDirection,
    type?: RepoType
  ): Promise<MinimalRepository[]> {
    const { public_repos } = await GithubServices.getUser(login);

    const pageSize = 10;
    const timesWillCall = Math.ceil(public_repos / pageSize);
    const promises = Array.from({ length: timesWillCall }, (_, i) =>
      GithubServices.getUserRepos(login, pageSize, i + 1, sort, direction, type)
    );
    return (await Promise.all(promises)).flatMap((result) => result);
  }

  public static async getOrgRepos(
    login: string,
    per_page?: number,
    page?: number,
    sort: RepoSort = "updated",
    direction?: RepoSortDirection,
    type?: RepoType
  ): Promise<MinimalRepository[]> {
    const url = GithubServices.makeRepoURL(
      "orgs",
      login,
      per_page,
      page,
      sort,
      direction,
      type
    );
    const res: Response = await fetch(url);
    const repositories: MinimalRepository[] = await res.json();
    return repositories;
  }

  public static async getAllOrgRepos(
    login: string,
    sort: RepoSort = "updated",
    direction?: RepoSortDirection,
    type?: RepoType
  ): Promise<MinimalRepository[]> {
    const { public_repos } = await GithubServices.getUser(login);

    const pageSize = 10;
    const timesWillCall = Math.ceil(public_repos / pageSize);
    const promises = Array.from({ length: timesWillCall }, (_, i) =>
      GithubServices.getUserRepos(login, pageSize, i + 1, sort, direction, type)
    );
    return (await Promise.all(promises)).flatMap((result) => result);
  }

  public static async getAllOrgsRepos(
    logins: string[],
    sort: RepoSort = "updated",
    direction?: RepoSortDirection,
    type?: RepoType
  ): Promise<MinimalRepository[]> {
    return (
      await Promise.all(
        logins.map((login) =>
          GithubServices.getAllOrgRepos(login, sort, direction, type)
        )
      )
    ).flatMap((result) => result);
  }

  public static async getCachedAllUserRepos(
    userLogin: string,
    orgLogins?: string[] | null,
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
    if (
      GithubServices.orgsRepos === null &&
      orgLogins !== null &&
      orgLogins !== undefined
    ) {
      GithubServices.orgsRepos = GithubServices.getAllOrgsRepos(
        orgLogins,
        sort,
        direction,
        type
      );
    }
    const userRepos = await GithubServices.userRepos;
    const orgsRepos = (await GithubServices.orgsRepos) ?? [];
    return [...userRepos, ...orgsRepos];
  }

  private static makeRepoURL(
    userType: "users" | "orgs",
    login: string,
    per_page?: number,
    page?: number,
    sort: RepoSort = "updated",
    direction?: RepoSortDirection,
    type?: RepoType
  ): string {
    let url = `https://api.github.com/${userType}/${login}/repos?sort=${sort}`;
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
    return url;
  }
}
