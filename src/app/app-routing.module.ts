import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth-guard';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';

const routes: Routes = [
 // { path: '',   redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
