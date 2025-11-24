import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidationCommerce } from './liquidation-commerce';

describe('LiquidationCommerce', () => {
  let component: LiquidationCommerce;
  let fixture: ComponentFixture<LiquidationCommerce>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiquidationCommerce]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiquidationCommerce);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
