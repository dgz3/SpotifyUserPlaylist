import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlManager } from './pl-manager';

describe('PlManager', () => {
  let component: PlManager;
  let fixture: ComponentFixture<PlManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
