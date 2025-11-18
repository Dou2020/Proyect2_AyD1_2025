import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Commerce } from './commerce';

describe('Commerce', () => {
  let component: Commerce;
  let fixture: ComponentFixture<Commerce>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Commerce]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Commerce);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
