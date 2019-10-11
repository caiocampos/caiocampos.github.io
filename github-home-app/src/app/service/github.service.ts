import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Repository } from '../model/repository';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private http: HttpClient, private configService: ConfigService) { }

  public getRepositories(sort = 'updated'): Observable<Array<Repository>> {
    return this.configService.config.pipe(
      switchMap((config) => {
        const link = `https://api.github.com/users/${config.user_login}/repos?sort=${sort}`;
        return this.http.get<Array<Repository>>(link);
      })
    );
  }
}
