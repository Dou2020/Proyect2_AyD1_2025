import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcursalFee } from './subcursal-fee';

describe('SubcursalFee', () => {
  let component: SubcursalFee;
  let fixture: ComponentFixture<SubcursalFee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcursalFee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcursalFee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
