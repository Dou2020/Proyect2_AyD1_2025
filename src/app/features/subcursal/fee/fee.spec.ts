import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fee } from './fee';

describe('Fee', () => {
  let component: Fee;
  let fixture: ComponentFixture<Fee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
