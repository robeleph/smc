import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePoEventComponent } from './invoice-po-event.component';

describe('InvoicePoEventComponent', () => {
  let component: InvoicePoEventComponent;
  let fixture: ComponentFixture<InvoicePoEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicePoEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePoEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
