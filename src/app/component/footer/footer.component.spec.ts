import { TestBed, waitForAsync } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    const app: FooterComponent = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
