import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFree } from './base-free';

describe('BaseFree', () => {
  let component: BaseFree;
  let fixture: ComponentFixture<BaseFree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseFree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseFree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
