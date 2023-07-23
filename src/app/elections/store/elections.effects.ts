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

  loadSingleElection$ = createEffect(
    (actions$ = inject(Actions), electionService = inject(ElectionService)) => {
      return actions$.pipe(
        ofType(loadSingleElectionAction),
        switchMap((action) => electionService.selectElection(action.payload)),
        map(election => loadSingleElectionFinishedAction({payload: election}))
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
