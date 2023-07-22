import {Component} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {from, of, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  loggedUserName$;
  isLoggedIn$;
  url: string;

  constructor(private keycloakService: KeycloakService,
              private route: ActivatedRoute) {
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
