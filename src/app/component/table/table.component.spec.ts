import { TestBed, async } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { TableComponent } from './table.component';
import { Config } from '../../model/config';
import { Language } from '../../model/language';
import { Repository } from '../../model/repository';

describe('TableComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [HttpClientTestingModule, FormsModule]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(TableComponent);
    const app: TableComponent = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should init', () => {
    const fixture = TestBed.createComponent(TableComponent);
    const app: TableComponent = fixture.debugElement.componentInstance;
    app.ngOnInit();
    app.config = getConfig();
    app.updateRepositories();
    app.clearFilters();
    expect(app).toBeTruthy();
  });

  it('should get Repository language', async(done => {
    const fixture = TestBed.createComponent(TableComponent);
    const app: TableComponent = fixture.debugElement.componentInstance;
    app.config = getConfig();
    app
      .getRepoLanguage(getRepo())
      .toPromise()
      .finally(done);
    expect(app).toBeTruthy();
  }));

  it('should get Repository language (null)', async(done => {
    const fixture = TestBed.createComponent(TableComponent);
    const app: TableComponent = fixture.debugElement.componentInstance;
    app.config = getConfig();
    app
      .getRepoLanguage(null)
      .toPromise()
      .finally(done);
    expect(app).toBeTruthy();
  }));

  it('should get Repository description', async(done => {
    const fixture = TestBed.createComponent(TableComponent);
    const app: TableComponent = fixture.debugElement.componentInstance;
    app.config = getConfig();
    app
      .getRepoDescription(getRepo())
      .toPromise()
      .finally(done);
    expect(app).toBeTruthy();
  }));

  it('should get Repository description', async(done => {
    const fixture = TestBed.createComponent(TableComponent);
    const app: TableComponent = fixture.debugElement.componentInstance;
    app.config = getConfig();
    app
      .getRepoDescription(null)
      .toPromise()
      .finally(done);
    expect(app).toBeTruthy();
  }));

  it('should filter Repositories', () => {
    const fixture = TestBed.createComponent(TableComponent);
    const app: TableComponent = fixture.debugElement.componentInstance;
    app.filterRepositories([getRepo()]);
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

function getRepo() {
  const repo = new Repository();
  repo.language = 'C';
  repo.description = 'C on https://stackoverflow.com';
  return repo;
}
