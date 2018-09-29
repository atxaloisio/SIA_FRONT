import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratanteFormComponent } from './contratante-form.component';

describe('ContratanteFormComponent', () => {
  let component: ContratanteFormComponent;
  let fixture: ComponentFixture<ContratanteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratanteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratanteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
