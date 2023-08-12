import {Component, Input, OnInit} from '@angular/core';
import {combineLatest, filter, map, Observable, startWith} from "rxjs";
import {DEFAULT_ELECTION, Election} from "../model/election";
import {Party} from "../model/party";
import {VotingResult} from "../model/voting-result";
import {Store} from "@ngrx/store";
import {electedCandidates, ElectionsState, modifiedElectionResult, selectedElection, selectedParties} from "../store";
import {
  calculateAction,
  loadElectionResultAction,
  loadPartiesAction,
  loadSingleElectionAction,
  modifyElectionResultAction,
  resetElectionResult
} from "../store/elections.actions";
import {DEFAULT_RESULT, ElectionResult} from "../model/election-result";
import {FormElectionResult} from "../model/form-election-result";
import {DEFAULT_ELECTED, ElectedCandidates} from "../model/elected-candidates";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AsyncPipe, NgIf} from "@angular/common";
import {ElectionComponent} from "../election/election.component";

export interface ModifiedElectionResult {
  electionName: string;
  overallResults: VotingResult[];
  constituencyResults: Map<string, VotingResult[]>;
}

export const DEFAULT_MODIFIED_RESULT: ModifiedElectionResult = {
  electionName: "",
  overallResults: [],
  constituencyResults: new Map<string, VotingResult[]>()
}

export interface ViewModel {
  election: Election;
  electionResult: ModifiedElectionResult;
  parties: Map<string, Party>;
}

@Component({
  selector: 'app-election-container',
  templateUrl: './election-container.component.html',
  styleUrls: ['./election-container.component.scss'],
  imports: [MatProgressSpinnerModule, AsyncPipe, ElectionComponent, NgIf],
  standalone: true
})
export class ElectionContainerComponent {
  election$: Observable<Election>;
  electionResult$: Observable<ModifiedElectionResult>;
  electedCandidates$: Observable<ElectedCandidates>;
  parties$: Observable<Map<string, Party>>;
  viewModel$: Observable<ViewModel|null>;

  constructor(private store: Store<ElectionsState>) {
    this.election$ = this.store.select<Election>(selectedElection());
    this.electedCandidates$ = this.store.select<ElectedCandidates>(electedCandidates())
      .pipe(
        filter(result => result != DEFAULT_ELECTED)
      );
    this.electionResult$ = this.store.select(modifiedElectionResult())
      .pipe(
        filter(result => result != DEFAULT_RESULT),
        map(result => {
          const constituencyMap = new Map<string, VotingResult[]>();
          for (const number in result?.constituencyResults) {
            constituencyMap.set(number, result?.constituencyResults[number]);
          }
          return {
            constituencyResults: constituencyMap,
            electionName: result.electionName,
            overallResults: result.overallResults
          };
        })
      );
    this.parties$ = this.store.select(selectedParties())
      .pipe(
        map(parties => {
          const map = new Map<string, Party>();
          parties.forEach((party) => map.set(party.abbreviation, party));
          return map;
        })
      );
    this.viewModel$ = combineLatest([this.election$, this.electionResult$, this.parties$])
      .pipe(
        map(([election, electionResult, parties]) => {
          return {
            election,
            electionResult,
            parties
          };
        }),
        filter(viewModel => {
          return viewModel.election != DEFAULT_ELECTION
            && viewModel.electionResult != DEFAULT_MODIFIED_RESULT
            && viewModel.parties.size > 0;
        }),
        startWith(null)
      );
  }

  @Input() set name(value: string) {
    if (value != null) {
      this.store.dispatch(loadSingleElectionAction({payload: value}));
      this.store.dispatch(loadElectionResultAction({payload: value}));
      this.store.dispatch(loadPartiesAction({payload: value}));
    }
  }

  onValueChanges(event: FormElectionResult) {
    this.store.dispatch(modifyElectionResultAction({payload: event}));
  }

  onCalculate(event: ElectionResult) {
    this.store.dispatch(calculateAction({payload: event}));
  }

  onReset() {
    this.store.dispatch(resetElectionResult());
  }
}
