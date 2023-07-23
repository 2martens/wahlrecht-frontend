import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LandingPageComponent} from "./landingpage/landing-page.component";
import {AppAuthGuard} from "../auth/auth.guard";
import {ElectionContainerComponent} from "./election-container/election-container.component";

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    canActivate: [AppAuthGuard],
  },
  {
    path: 'election/:name',
    component: ElectionContainerComponent,
    canActivate: [AppAuthGuard],
    resolve: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectionsRoutingModule {
}
