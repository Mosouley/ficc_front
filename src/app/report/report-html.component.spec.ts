import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHtmlComponent } from './report-html.component';

describe('ReportHtmlComponent', () => {
  let component: ReportHtmlComponent;
  let fixture: ComponentFixture<ReportHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
