import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {NavigationComponent} from "./navigation/navigation.component";
import {KeycloakAngularModule} from "keycloak-angular";
import {MatSidenavModule} from "@angular/material/sidenav";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, KeycloakAngularModule, MatSidenavModule, NoopAnimationsModule,
      MatToolbarModule, MatListModule, MatIconModule],
    declarations: [AppComponent, NavigationComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
