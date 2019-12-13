import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Config } from '../model/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private static configuration: Config = null;

  constructor(private http: HttpClient) {}

  get config(): Observable<Config> {
    if (!ConfigService.configuration) {
      const overwrite = this.overwrite.bind(this);
      return this.http.get<Config>('/assets/config.json').pipe(map(overwrite));
    }
    return of(ConfigService.configuration);
  }

  overwrite(config: Config): Config {
    ConfigService.configuration = config;
    return config;
  }
}
