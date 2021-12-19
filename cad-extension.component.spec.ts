import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadExtensionComponent } from './cad-extension.component';

describe('CadExtensionComponent', () => {
  let component: CadExtensionComponent;
  let fixture: ComponentFixture<CadExtensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadExtensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
