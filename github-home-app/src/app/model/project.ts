import { Repository } from './repository';

// tslint:disable: variable-name
export class Project {
    id: number;
    node_id: string;
    name: string;
    number: number;
    repos: Array<Repository>;
}
// tslint:enable: variable-name
