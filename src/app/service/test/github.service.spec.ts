import { TestBed, waitForAsync } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GithubService } from '../github.service';
import { Config } from 'src/app/model/config';

describe('GithubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', () => {
    const service: GithubService = TestBed.get(GithubService);
    expect(service).toBeTruthy();
  });

  it('should get the repositories', waitForAsync(done => {
    const service: GithubService = TestBed.get(GithubService);
    service
      .getRepositories()
      .toPromise()
      .finally(done);
    expect(service).toBeTruthy();
  }));

  it('should get the repositories by config', waitForAsync(done => {
    const service: GithubService = TestBed.get(GithubService);
    service
      .getConfigRepositories(getConfig())
      .toPromise()
      .finally(done);
    expect(service).toBeTruthy();
  }));
});

function getConfig() {
  const config = new Config();
  config.user_login = 'caiocampos';
  return config;
}
