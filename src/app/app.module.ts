import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DashboardComponent} from './dashboard/dashboard.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {PermissionDeniedComponent} from './permission-denied/permission-denied.component';
import {HttpClientModule} from "@angular/common/http";
import {environment} from "../environments/environment";
import {NavigationComponent} from './navigation/navigation.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from "@angular/material/menu";
import {MatTableModule} from "@angular/material/table";
import {StoreModule} from '@ngrx/store';
import {ElectionsModule} from "./elections/elections.module";
import {EffectsModule} from '@ngrx/effects';
import {MessagesModule} from "./messages/messages.module";

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
      keycloak.init({
        config: {
          url: environment.keycloakURL,
          realm: environment.realm,
          clientId: environment.clientId,
        },
        initOptions: {
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri:
              window.location.origin + '/assets/silent-check-sso.html',
          flow: "standard"
        },
        shouldAddToken: (request) => {
          const {url} = request;
          return url.startsWith(environment.backendURL);
        },
        loadUserProfileAtStartUp: true
      });
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PermissionDeniedComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    KeycloakAngularModule,
    HttpClientModule,
    MatSidenavModule,
    MatMenuModule,
    MatTableModule,
    MessagesModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([])
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
