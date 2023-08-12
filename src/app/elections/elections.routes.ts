import {Route} from "@angular/router";
import {LandingPageComponent} from "./landingpage/landing-page.component";
import {AppAuthGuard} from "../auth/auth.guard";
import {ElectionContainerComponent} from "./election-container/election-container.component";

export const ELECTION_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./landingpage/landing-page.component').then(mod => mod.LandingPageComponent),
    canActivate: [AppAuthGuard],
  },
  {
    path: 'election/:name',
    component: ElectionContainerComponent,
    canActivate: [AppAuthGuard],
    resolve: []
  }
];
