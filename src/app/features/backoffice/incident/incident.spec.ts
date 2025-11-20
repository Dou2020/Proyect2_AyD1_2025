import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Incident } from './incident';

describe('Incident', () => {
  let component: Incident;
  let fixture: ComponentFixture<Incident>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Incident]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Incident);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
