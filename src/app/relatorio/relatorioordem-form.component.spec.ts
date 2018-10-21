import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioOrdemFormComponent } from './relatorioordem-form.component';

describe('RelatorioOrdemClienteFormComponent', () => {
  let component: RelatorioOrdemFormComponent;
  let fixture: ComponentFixture<RelatorioOrdemFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioOrdemFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioOrdemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
