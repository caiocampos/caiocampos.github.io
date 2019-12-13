import { TestBed, async } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { Config } from '../../model/config';
import { Language } from '../../model/language';
import { TableComponent } from '../table/table.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TableComponent,
        HeaderComponent,
        FooterComponent
      ],
      imports: [HttpClientTestingModule, FormsModule]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app: AppComponent = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should init', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app: AppComponent = fixture.debugElement.componentInstance;
    app.ngOnInit();
    app.configurate(getConfig());
    expect(app).toBeTruthy();
  });
});

function getConfig() {
  const config = new Config();
  const language = new Language();
  language.name = 'C';
  config.languages = [language];
  return config;
}
