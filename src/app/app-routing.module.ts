import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimOperationsComponent } from './components/sim-operations/sim-operations.component';

const routes: Routes = [
  { path: '', component: SimOperationsComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }