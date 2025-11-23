import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporalTransfer } from './temporal-transfer';

describe('TemporalTransfer', () => {
  let component: TemporalTransfer;
  let fixture: ComponentFixture<TemporalTransfer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporalTransfer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporalTransfer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
