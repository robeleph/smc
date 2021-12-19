import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarReportComponent } from './navbar-report.component';

describe('NavbarReportComponent', () => {
  let component: NavbarReportComponent;
  let fixture: ComponentFixture<NavbarReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
