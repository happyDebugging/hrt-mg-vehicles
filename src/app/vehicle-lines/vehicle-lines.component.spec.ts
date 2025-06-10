import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleLinesComponent } from './vehicle-lines.component';

describe('VehicleLinesComponent', () => {
  let component: VehicleLinesComponent;
  let fixture: ComponentFixture<VehicleLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleLinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
