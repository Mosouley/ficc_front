import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxblotterComponent } from './fxblotter.component';

describe('FxblotterComponent', () => {
  let component: FxblotterComponent;
  let fixture: ComponentFixture<FxblotterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxblotterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxblotterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
