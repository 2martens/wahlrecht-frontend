import {Component} from '@angular/core';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {from, of, switchMap} from "rxjs";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {AsyncPipe, NgIf} from "@angular/common";
import {provideHttpClient} from "@angular/common/http";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  imports: [RouterModule,
    KeycloakAngularModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
    AsyncPipe,
  ],
  providers: [

  ],
  standalone: true
})
export class NavigationComponent {
  loggedUserName$;
  isLoggedIn$;
  url: string;

  constructor(private keycloakService: KeycloakService,
              route: ActivatedRoute) {
    this.url = route.snapshot.url.join('');
    this.isLoggedIn$ = from(this.keycloakService.isLoggedIn());
    this.loggedUserName$ = this.isLoggedIn$.pipe(
      switchMap(loggedIn => {
        if (loggedIn) {
          return of(this.keycloakService.getUsername());
        } else {
          return of('');
        }
      })
    )
  }

  login(): void {
    this.keycloakService.login({
      redirectUri: window.location.origin + this.url,
    });
  }

  logout(): void {
    this.keycloakService.logout(window.location.origin);
  }
}
