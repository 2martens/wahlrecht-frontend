import {inject, Injectable} from "@angular/core";
import {ElectionService} from "../election.service";
import {
  loadAllElectionsAction,
  loadAllElectionsFinishedAction,
  loadElectionResultAction,
  loadElectionResultFinishedAction,
  loadPartiesAction,
  loadPartiesFinishedAction,
  loadSingleElectionAction,
  loadSingleElectionFinishedAction
} from "./elections.actions";
import {map, switchMap} from "rxjs";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Election} from "../model/election";
import {VotingThreshold} from "../model/voting-threshold";

@Injectable()
export class ElectionsEffects {

  loadAllElections$ = createEffect(
    (actions$ = inject(Actions), electionService = inject(ElectionService)) => {
      return actions$.pipe(
        ofType(loadAllElectionsAction),
        switchMap(() => electionService.fetchElections()),
        map(elections => elections.map(this.map)),
        map(elections => loadAllElectionsFinishedAction({payload: elections}))
      )
    },
    {functional: true});

  loadElectionResult$ = createEffect(
    (actions$ = inject(Actions), electionService = inject(ElectionService)) => {
      return actions$.pipe(
        ofType(loadElectionResultAction),
        switchMap((action) => electionService.fetchElectionResult(action.payload)),
        map(result => loadElectionResultFinishedAction({payload: result}))
      )
    },
    {functional: true});

  loadSingleElection$ = createEffect(
    (actions$ = inject(Actions), electionService = inject(ElectionService)) => {
      return actions$.pipe(
        ofType(loadSingleElectionAction),
        switchMap((action) => electionService.fetchElection(action.payload)),
        map(election => loadSingleElectionFinishedAction({payload: election}))
      )
    },
    {functional: true});

  loadParties$ = createEffect(
    (actions$ = inject(Actions), electionService = inject(ElectionService)) => {
      return actions$.pipe(
        ofType(loadPartiesAction),
        switchMap((action) => electionService.fetchParties(action.payload)),
        map(parties => loadPartiesFinishedAction({payload: parties}))
      )
    },
    {functional: true});

  private map(election: Election): Election {
    switch (<string>election.votingThreshold) {
      case "NONE":
        election.votingThreshold = VotingThreshold.NONE;
        break;
      case "THREE":
        election.votingThreshold = VotingThreshold.THREE;
        break;
      case "FIVE":
        election.votingThreshold = VotingThreshold.FIVE;
        break;
    }

    return election;
  }
}
