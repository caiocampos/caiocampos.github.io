import { Repository } from './repository';
import { Project } from './project';

export class RepositoryFilter {
    name: string;
    lang: string;
    project: string;

    constructor(name = '', lang = '', project = '') {
        this.name = name;
        this.lang = lang;
        this.project = project;
    }

    public match(repo: Repository, projects: Array<Project> = []): boolean {
        const { name, lang, project } = this;
        if (name && !repo.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())) {
            return false;
        }
        if (lang && repo.language !== lang) {
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
