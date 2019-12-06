import { TestBed, async } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', () => {
    const service: ConfigService = TestBed.get(ConfigService);
    expect(service).toBeTruthy();
  });

  it('should get the configuration', async(() => {
    const service: ConfigService = TestBed.get(ConfigService);
    service
      .config.subscribe(
      (config) => {
        expect(config).toBeDefined();
      }
    );
  }));
});
