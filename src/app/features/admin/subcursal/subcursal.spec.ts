import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subcursal } from './subcursal';

describe('Subcursal', () => {
  let component: Subcursal;
  let fixture: ComponentFixture<Subcursal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subcursal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subcursal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
