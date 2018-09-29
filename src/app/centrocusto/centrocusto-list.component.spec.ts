import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroCustoListComponent } from './centrocusto-list.component';

describe('CentroCustoComponent', () => {
  let component: CentroCustoListComponent;
  let fixture: ComponentFixture<CentroCustoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentroCustoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroCustoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
