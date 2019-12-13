import { TestBed, async } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ConfigService } from '../config.service';
import { Config } from 'src/app/model/config';

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

  it('should get the configuration', async(done => {
    const service: ConfigService = TestBed.get(ConfigService);
    service.config.toPromise().finally(done);
    expect(service).toBeTruthy();
  }));

  it('should overwrite the configuration', async(done => {
    const service: ConfigService = TestBed.get(ConfigService);
    service.overwrite(new Config());
    service.config.toPromise().finally(done);
    expect(service).toBeTruthy();
  }));
});
