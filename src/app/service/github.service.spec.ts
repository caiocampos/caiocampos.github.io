import { TestBed, async } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GithubService } from './github.service';

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

  it('should get the repositories', async(() => {
    const service: GithubService = TestBed.get(GithubService);
    service
      .getRepositories().subscribe(
      (repositories) => {
        expect(repositories).toBeDefined();
      }
    );
  }));
});
