import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearedPOComponent } from './cleared-po.component';

describe('ClearedPOComponent', () => {
  let component: ClearedPOComponent;
  let fixture: ComponentFixture<ClearedPOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearedPOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearedPOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
