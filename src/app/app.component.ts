import {Component} from '@angular/core';
import {NavigationComponent} from "./navigation/navigation.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NavigationComponent, RouterOutlet]
})
export class AppComponent {
}
