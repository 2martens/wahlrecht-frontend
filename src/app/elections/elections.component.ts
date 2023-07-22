import {Component, OnInit} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {Election} from "./model/election";
import {tap} from "rxjs";
import {Store} from "@ngrx/store";
import {allElections} from "./store";
import {loadAllElectionsAction} from "./store/elections.actions";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-elections',
  templateUrl: './elections.component.html',
  styleUrls: ['./elections.component.scss']
})
export class ElectionsComponent implements OnInit {
  electionColumns = ['name', 'day', 'totalNumberOfSeats', 'votingThreshold'];
  dataSource = new MatTableDataSource<Election>();
  elections$;

  constructor(private keycloakService: KeycloakService,
              private store: Store) {
    this.elections$ = this.store.select(allElections())
      .pipe(
        tap(elections => this.dataSource.data = elections)
      );
  }

  ngOnInit() {
    this.store.dispatch(loadAllElectionsAction());
  }
}
