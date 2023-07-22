import {inject, Injectable} from "@angular/core";
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

  loadAllElections$ = createEffect(
    (actions$ = inject(Actions), electionService = inject(ElectionService)) => {
      return actions$.pipe(
        ofType(loadAllElectionsAction),
        switchMap(() => electionService.fetchElections()),
        map(elections => loadAllElectionsFinishedAction({payload: elections}))
      )
    },
    {functional: true});

  loadSingleElection$ = createEffect(
    (actions$ = inject(Actions), electionService = inject(ElectionService)) => {
      return actions$.pipe(
        ofType(loadSingleElectionAction),
        switchMap((action) => electionService.selectElection(action.payload)),
        map(election => loadSingleElectionFinishedAction({payload: election}))
      )
    },
    {functional: true});
}
