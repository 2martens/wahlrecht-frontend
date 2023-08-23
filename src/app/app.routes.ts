import {Route} from "@angular/router";
import {provideState} from "@ngrx/store";
import {electionsReducers, featureStateName} from "./elections/store";
import {provideEffects} from "@ngrx/effects";
import {ElectionsEffects} from "./elections/store/elections.effects";

export const ROOT_ROUTES: Route[] = [
  {
    path: 'elections',
    providers: [
      provideState(featureStateName, electionsReducers),
      provideEffects([ElectionsEffects]),
    ],
    loadChildren: () => import("./elections/elections.routes").then(mod => mod.ELECTION_ROUTES)
  },
  {
    path: 'permission-denied',
    loadComponent: () => import("./permission-denied/permission-denied.component")
      .then(mod => mod.PermissionDeniedComponent)
  },
  {
    path: 'legal-notice',
    loadComponent: () => import("./legal-notice/legal-notice.component").then(mod => mod.LegalNoticeComponent)
  },
  {
    path: '',
    loadComponent: () => import("./dashboard/dashboard.component").then(mod => mod.DashboardComponent),
    pathMatch: 'full'
  }
];
