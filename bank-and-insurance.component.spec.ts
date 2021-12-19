import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAndInsuranceComponent } from './bank-and-insurance.component';

describe('BankAndInsuranceComponent', () => {
  let component: BankAndInsuranceComponent;
  let fixture: ComponentFixture<BankAndInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankAndInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAndInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
