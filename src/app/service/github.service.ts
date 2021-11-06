import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, interval } from 'rxjs';
import { switchMap, reduce, concatMap, takeWhile } from 'rxjs/operators';

import { Repository } from '../model/repository';
import { ConfigService } from './config.service';
import { Config } from '../model/config';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getRepositories = (
    sort = 'updated',
    per_page = 20
  ): Observable<Array<Repository>> => {
    return this.configService.config.pipe(
      switchMap((config) =>
        interval(300).pipe(
          concatMap((page) =>
            this.getConfigRepositories(config, page + 1, sort, per_page)
          ),
          takeWhile((list) => list.length > 0),
          reduce((acc, val) => acc.concat(val))
        )
      )
    );
  };

  getConfigRepositories = (
    config: Config,
    page = 1,
    sort = 'updated',
    per_page = 20
  ): Observable<Array<Repository>> => {
    const link = `https://api.github.com/users/${config.user_login}/repos?sort=${sort}&per_page=${per_page}&page=${page}`;
    return this.http.get<Array<Repository>>(link);
  };
}
