import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradesflowComponent } from './tradesflow.component';

describe('TradesflowComponent', () => {
  let component: TradesflowComponent;
  let fixture: ComponentFixture<TradesflowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradesflowComponent]
    });
    fixture = TestBed.createComponent(TradesflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
