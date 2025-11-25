import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketGroup } from './ticket-group';

describe('TicketGroup', () => {
  let component: TicketGroup;
  let fixture: ComponentFixture<TicketGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
