import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomSnackBar } from './custom-snack-bar';

describe('CustomSnackBar', () => {
  let component: CustomSnackBar;
  let fixture: ComponentFixture<CustomSnackBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSnackBar]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CustomSnackBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
