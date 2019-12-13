import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Repository } from '../model/repository';
import { ConfigService } from './config.service';
import { Config } from '../model/config';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getRepositories(sort = 'updated'): Observable<Array<Repository>> {
    return this.configService.config.pipe(
      switchMap(config => this.getConfigRepositories(config, sort))
    );
  }

  getConfigRepositories(
    config: Config,
    sort = 'updated'
  ): Observable<Array<Repository>> {
    const link = `https://api.github.com/users/${config.user_login}/repos?sort=${sort}`;
    return this.http.get<Array<Repository>>(link);
  }
}
