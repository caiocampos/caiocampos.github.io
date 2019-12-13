import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ConfigService } from '../../service/config.service';

import { Config } from '../../model/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  config: Config;
  link = '';

  constructor(
    private configService: ConfigService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    const configurate = this.configurate.bind(this);
    this.configService.config.toPromise().then(configurate);
  }

  configurate(config: Config): void {
    if (config) {
      this.titleService.setTitle(config.title);
      this.link = `https://github.com/${config.user_login}`;
      this.config = config;
    }
  }
}
