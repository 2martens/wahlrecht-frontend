import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription, tap} from "rxjs";
import {Store} from "@ngrx/store";
import {allElections, ElectionsState} from "../store";
import {loadAllElectionsAction} from "../store/elections.actions";
import {Election} from "../model/election";

@Component({
  selector: 'app-elections',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  private store: Store<ElectionsState> = inject(Store<ElectionsState>);
  electionColumns: string[] = ['name', 'day', 'totalNumberOfSeats', 'votingThreshold'];
  elections: Election[] = [];
  elections$ = this.store.select(allElections());
  private subscription?: Subscription;

  ngOnInit() {
    this.store.dispatch(loadAllElectionsAction());
    this.subscription = this.elections$.subscribe({
      next: (newData) => {
        this.elections = newData;
      }
    })
  }

  ngOnDestroy() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }
}
