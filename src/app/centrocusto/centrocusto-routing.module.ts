import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { CentroCustoListComponent } from './centrocusto-list.component';
import { CentroCustoFormComponent } from './centrocusto-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'centrocustos',
    component: CentroCustoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'centrocustos/centrocusto',
    component: CentroCustoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'centrocustos/centrocusto/:id',
    component: CentroCustoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentroCustoRoutingModule {}
