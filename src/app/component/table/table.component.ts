import { Component, OnInit, Input } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { GithubService } from '../../service/github.service';

import { Repository } from '../../model/repository';
import { Project } from '../../model/project';
import { Language } from '../../model/language';
import { Config } from '../../model/config';
import { RepositoryFilter } from '../../model/repository-filter';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  repositories$: Observable<Array<Repository>>;
  projects: Array<Project>;
  languages = {};
  langNames = [];
  filter = new RepositoryFilter();
  showFilters = window.innerWidth > 1000;

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.repositories$ = this.githubService.getRepositories();
  }

  @Input()
  set config(config) {
    this.configurate(config);
  }

  configurate = (config: Config): void => {
    if (config) {
      this.projects = config.projects || [];
      for (const language of config.languages) {
        if (language.name) {
          this.languages[language.name] = language;
          this.langNames.push(language.name);
        }
      }
    }
  };

  getRepoLanguage = (repo: Repository): Observable<Language> => {
    if (repo && repo.language && this.languages[repo.language]) {
      return of(this.languages[repo.language]);
    }
    return of(...[]);
  };

  getRepoDescription = (repo: Repository): Observable<string> => {
    if (repo && repo.description) {
      let description = repo.description;
      description = description.replace(/([.:])\s+/g, '$1<br>');
      description = description.replace(
        /(http[s]?:\/\/[.a-z@/-]+)/gi,
        '<a href="$1">$1</a>'
      );
      return of(description);
    }
    return of(...[]);
  };

  updateRepositories = (): void => {
    this.repositories$ = this.githubService
      .getRepositories()
      .pipe(map(this.filterRepositories));
  };

  filterRepositories = (repositories: Array<Repository>): Array<Repository> =>
    repositories.filter((repo) => this.filter.match(repo, this.projects));

  clearFilters = (): void => {
    this.filter = new RepositoryFilter();
    this.updateRepositories();
  };
}
