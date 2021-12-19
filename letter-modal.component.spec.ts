import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterModalComponent } from './letter-modal.component';

describe('LetterModalComponent', () => {
  let component: LetterModalComponent;
  let fixture: ComponentFixture<LetterModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
