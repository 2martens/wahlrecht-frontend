import {Component} from '@angular/core';
import {NavigationComponent} from "./navigation/navigation.component";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NavigationComponent, RouterModule]
})
export class AppComponent {
}
