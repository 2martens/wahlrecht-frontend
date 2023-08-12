import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';

import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';
import {Injectable} from '@angular/core';
import {Location} from "@angular/common";

@Injectable({
  providedIn: 'root',
})
export class AppAuthGuard extends KeycloakAuthGuard {

  constructor(protected override readonly router: Router,
              protected readonly keycloak: KeycloakService,
              private readonly location: Location) {
    super(router, keycloak);
  }

  async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated || this.keycloak.isTokenExpired()) {
      await this.keycloak.login({
        redirectUri: `${window.location.origin}${this.location.prepareExternalUrl(state.url)}`,
      });
    }

    // Get the roles required from the route.
    const requiredRoles = route.data['roles'];

    let granted: boolean;

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      granted = true;
      return granted;
    }

    // Allow the user to proceed if all the required roles are present.
    granted = requiredRoles.every((role) => this.roles.includes(role));

    // Routing user into permission denied view if they don't have necessary roles.
    if (!granted) {
      await this.router.navigate(['permission-denied']);
    }

    return granted;
  }

}
