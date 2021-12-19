import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueContractComponent } from './issue-contract.component';

describe('IssueContractComponent', () => {
  let component: IssueContractComponent;
  let fixture: ComponentFixture<IssueContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
