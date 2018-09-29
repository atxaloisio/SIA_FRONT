import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroCustoFormComponent } from './centrocusto-form.component';

describe('CentroCustoFormComponent', () => {
  let component: CentroCustoFormComponent;
  let fixture: ComponentFixture<CentroCustoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentroCustoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroCustoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
