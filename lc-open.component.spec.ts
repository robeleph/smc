import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcOpenComponent } from './lc-open.component';

describe('LcOpenComponent', () => {
  let component: LcOpenComponent;
  let fixture: ComponentFixture<LcOpenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcOpenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
