import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasePerformanceComponent } from './release-performance.component';

describe('ReleasePerformanceComponent', () => {
  let component: ReleasePerformanceComponent;
  let fixture: ComponentFixture<ReleasePerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleasePerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
