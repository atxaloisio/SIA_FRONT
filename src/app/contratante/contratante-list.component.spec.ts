import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratanteListComponent } from './contratante-list.component';

describe('ContratanteComponent', () => {
  let component: ContratanteListComponent;
  let fixture: ComponentFixture<ContratanteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratanteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratanteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
