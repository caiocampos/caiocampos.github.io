import { Project } from './project';
import { Language } from './language';

// tslint:disable: variable-name
export class Config {
    title: string;
    user_name: string;
    user_login: string;
    user_id: number;
    user_node_id: string;
    projects: Array<Project>;
    languages: Array<Language>;
}
// tslint:enable: variable-name
