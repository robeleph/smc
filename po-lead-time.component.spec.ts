import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoLeadTimeComponent } from './po-lead-time.component';

describe('PoLeadTimeComponent', () => {
  let component: PoLeadTimeComponent;
  let fixture: ComponentFixture<PoLeadTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoLeadTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoLeadTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
