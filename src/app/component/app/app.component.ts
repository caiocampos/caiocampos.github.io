import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ConfigService } from '../../service/config.service';

import { Config } from '../../model/config';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  config: Config;
  link = '';

  constructor(
    private configService: ConfigService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    firstValueFrom(this.configService.config).then(this.configurate);
  }

  configurate = (config: Config): void => {
    if (config) {
      this.titleService.setTitle(config.title);
      this.link = `https://github.com/${config.user_login}`;
      this.config = config;
    }
  };
}
