import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ElectionsComponent} from "./elections.component";
import {AppAuthGuard} from "../auth/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: ElectionsComponent,
    canActivate: [AppAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectionsRoutingModule {
}
