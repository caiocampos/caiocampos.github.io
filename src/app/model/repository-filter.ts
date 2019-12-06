import { Repository } from './repository';
import { Project } from './project';

export class RepositoryFilter {
  name: string;
  desc: string;
  lang: string;
  project: string;

  constructor({ name = '', desc = '', lang = '', project = '' } = {}) {
    this.name = name;
    this.desc = desc;
    this.lang = lang;
    this.project = project;
  }

  public match(repo: Repository, projects: Array<Project> = []): boolean {
    const { name, lang, desc, project } = this;
    if (name && !includes(repo.name, name)) {
      return false;
    }
    if (lang && repo.language !== lang) {
      return false;
    }
    if (desc && !includes(repo.description, desc)) {
      return false;
    }
    if (project) {
      const pId = Number(project);
      const selected = projects.find(({ id }) => id === pId);
      if (!selected || !selected.repos.find(({ id }) => id === repo.id)) {
        return false;
      }
    }
    return true;
  }
}

function includes(str: string, searchString: string): boolean {
  return str.toLocaleLowerCase().includes(searchString.toLocaleLowerCase());
}
