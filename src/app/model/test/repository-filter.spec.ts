import { RepositoryFilter } from '../repository-filter';
import { Repository } from '../repository';
import { Project } from '../project';

describe('RepositoryFilter', () => {
  it('should create an instance', () => {
    expect(new RepositoryFilter()).toBeTruthy();
  });

  it('should not match by name', () => {
    const repo = new Repository();
    repo.name = 'name';
    const filter = new RepositoryFilter({ name: 'Teste' });

    expect(filter.match(repo)).toBeFalse();
  });

  it('should not match by language', () => {
    const repo = new Repository();
    repo.name = 'Teste';
    repo.language = 'language';
    const filter = new RepositoryFilter({ name: 'Teste', lang: 'Teste' });

    expect(filter.match(repo)).toBeFalse();
  });

  it('should not match by description', () => {
    const repo = new Repository();
    repo.name = 'Teste';
    repo.language = 'Teste';
    repo.description = 'description';
    const filter = new RepositoryFilter({
      name: 'Teste',
      lang: 'Teste',
      desc: 'Teste'
    });

    expect(filter.match(repo)).toBeFalse();
  });

  it('should not match by project', () => {
    const repo = new Repository();
    repo.name = 'Teste';
    repo.language = 'Teste';
    repo.description = 'Teste';
    const filter = new RepositoryFilter({
      name: 'Teste',
      lang: 'Teste',
      desc: 'Teste',
      project: '1'
    });

    expect(filter.match(repo)).toBeFalse();
  });

  it('should match', () => {
    const repo = new Repository();
    repo.id = 1;
    repo.name = 'Teste';
    repo.language = 'Teste';
    repo.description = 'Teste';
    const filter = new RepositoryFilter({
      name: 'Teste',
      lang: 'Teste',
      desc: 'Teste',
      project: '1'
    });
    const project = new Project();
    project.id = 1;
    const projectRepo = new Repository();
    projectRepo.id = 1;
    project.repos = [projectRepo];

    expect(filter.match(repo, [project])).toBeTrue();
  });
});
