import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LandingPageComponent} from "./landingpage/landing-page.component";
import {AppAuthGuard} from "../auth/auth.guard";
import {ElectionComponent} from "./election/election.component";

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    canActivate: [AppAuthGuard],
  },
  {
    path: 'election/:name',
    component: ElectionComponent,
    canActivate: [AppAuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectionsRoutingModule {
}
