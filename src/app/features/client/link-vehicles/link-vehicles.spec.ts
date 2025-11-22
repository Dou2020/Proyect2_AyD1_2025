import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkVehicles } from './link-vehicles';

describe('LinkVehicles', () => {
  let component: LinkVehicles;
  let fixture: ComponentFixture<LinkVehicles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkVehicles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkVehicles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
