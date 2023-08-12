/// <reference types="@angular/localize" />

import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {APP_INITIALIZER} from "@angular/core";
import {KeycloakBearerInterceptor, KeycloakService} from "keycloak-angular";
import {environment} from "./environments/environment";
import {provideRouter, withComponentInputBinding} from "@angular/router";
import {provideStore} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {provideAnimations} from "@angular/platform-browser/animations";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {ROOT_ROUTES} from "./app/app.routes";
import "@angular/localize/init";
import {Location} from "@angular/common";

function initializeKeycloak(keycloak: KeycloakService, locationService: Location) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloakURL,
        realm: environment.realm,
        clientId: environment.clientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:`${window.location.origin}${locationService.prepareExternalUrl('/assets/silent-check-sso.html')}`,
        flow: "standard"
      },
      shouldAddToken: (request) => {
        const {url} = request;
        return url.startsWith(environment.backendURL);
      },
      loadUserProfileAtStartUp: true
    });
}

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, Location],
    },
    provideRouter(ROOT_ROUTES,
      withComponentInputBinding()),
    provideStore(),
    provideEffects(),
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    KeycloakService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true
    }
  ]
}).catch(err => console.error(err));
