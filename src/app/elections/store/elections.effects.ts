import {Injectable} from "@angular/core";
import {ElectionService} from "../election.service";
import {
  loadAllElectionsAction,
  loadAllElectionsFinishedAction,
  loadSingleElectionAction,
  loadSingleElectionFinishedAction
} from "./elections.actions";
import {map, switchMap} from "rxjs";
import {Actions, createEffect, ofType} from "@ngrx/effects";

@Injectable()
export class ElectionsEffects {
  constructor(private actions$: Actions,
              private electionService: ElectionService) {
  }

  loadAllElections$ = createEffect(() => this.actions$.pipe(
      ofType(loadAllElectionsAction),
      switchMap(() => this.electionService.getElections()
          .pipe(
              map(elections => loadAllElectionsFinishedAction({payload: elections}))
          )
      )
  ));

  loadSingleElection$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(loadSingleElectionAction),
        switchMap((action) => this.electionService.selectElection(action.payload)
            .pipe(
                map(election =>
                    loadSingleElectionFinishedAction({payload: election}))
            )
        ),
    )
  });
}
