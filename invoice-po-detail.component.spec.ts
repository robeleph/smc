import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePoDetailComponent } from './invoice-po-detail.component';

describe('InvoicePoDetailComponent', () => {
  let component: InvoicePoDetailComponent;
  let fixture: ComponentFixture<InvoicePoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicePoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
