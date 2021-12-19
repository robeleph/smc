import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceBondComponent } from './performance-bond.component';

describe('PerformanceBondComponent', () => {
  let component: PerformanceBondComponent;
  let fixture: ComponentFixture<PerformanceBondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceBondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceBondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
