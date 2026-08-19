import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlLogin } from './pl-login';

describe('PlLogin', () => {
  let component: PlLogin;
  let fixture: ComponentFixture<PlLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
