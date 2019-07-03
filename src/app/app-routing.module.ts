import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreviewComponent } from './preview/preview.component';
import { SivnormComponent } from './sivnorm/sivnorm.component';
import { AuthentificationComponent } from './authentification/authentification.component';

const routes: Routes = [
  { path: '', redirectTo: '/preview', pathMatch: 'full' },
  { path: 'preview', component: PreviewComponent },
  { path: 'sivnorm', component: SivnormComponent },
  { path: 'authentification', component: AuthentificationComponent },
  { path: '**', component: PreviewComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
