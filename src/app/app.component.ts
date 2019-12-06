import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigService } from './service/config.service';
import { GithubService } from './service/github.service';

import { Repository } from './model/repository';
import { Project } from './model/project';
import { Language } from './model/language';
import { Config } from './model/config';
import { RepositoryFilter } from './model/repository-filter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  repositories$: Observable<Array<Repository>>;
  projects: Array<Project>;
  languages = {};
  langNames = [];
  link = '';
  filter = new RepositoryFilter();

  constructor(
    private configService: ConfigService,
    private githubService: GithubService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    const configurate = this.configurate.bind(this);
    this.configService.config.toPromise().then(configurate);
    this.repositories$ = this.githubService.getRepositories();
  }

  configurate(config: Config) {
    if (config) {
      this.titleService.setTitle(config.title);
      this.link = `https://github.com/${config.user_login}`;
      this.projects = config.projects || [];
      for (const language of config.languages) {
        if (language.name) {
          this.languages[language.name] = language;
          this.langNames.push(language.name);
        }
      }
    }
  }

  getLanguage(name: string): Observable<Language> {
    if (name && this.languages[name]) {
      return of(this.languages[name]);
    }
    return of(...[]);
  }

  updateRepositories(): void {
    const filter = this.filter;
    const projects = this.projects;
    this.repositories$ = this.githubService
      .getRepositories()
      .pipe(map(data => data.filter(repo => filter.match(repo, projects))));
  }

  clearFilters(): void {
    this.filter = new RepositoryFilter();
    this.updateRepositories();
  }
}
