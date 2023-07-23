import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ElectionsState, selectedElection, selectedElectionResult, selectedParties} from "../store";
import {Store} from "@ngrx/store";
import {loadElectionResultAction, loadPartiesAction, loadSingleElectionAction} from "../store/elections.actions";
import {map, Observable, of} from "rxjs";
import {Election} from "../model/election";
import {ElectionResult} from "../model/election-result";
import {KeyValue} from "@angular/common";
import {Party} from "../model/party";
import {VotingResult} from "../model/voting-result";
import {Constituency} from "../model/constituency";

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.scss']
})
export class ElectionComponent implements OnInit {
  election$: Observable<Election|undefined> = of();
  electionResult$: Observable<ElectionResult|undefined> = of();
  parties$: Observable<Map<string, Party>> = of(new Map<string, Party>());

  constructor(private route: ActivatedRoute,
              private store: Store<ElectionsState>) {
    this.election$ = this.store.select(selectedElection());
    this.electionResult$ = this.store.select(selectedElectionResult());
    this.parties$ = this.store.select(selectedParties())
      .pipe(
        map(parties => {
          const map = new Map<string, Party>();
          parties.forEach((party) => map.set(party.abbreviation, party));
          return map;
        })
      );
  }

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get("name");
    if (name != null) {
      this.store.dispatch(loadSingleElectionAction({payload: name}));
      this.store.dispatch(loadElectionResultAction({payload: name}));
      this.store.dispatch(loadPartiesAction({payload: name}));
    }
  }

  keyAscOrder = (a: KeyValue<string,number>, b: KeyValue<string,number>): number => {
    return +a.key < +b.key ? -1 : (+a.key > +b.key ? 1 : 0);
  }

  getCandidateNameOverall(abbreviation: string, position: number): Observable<string|undefined> {
    return this.parties$.pipe(
      map(map => map.get(abbreviation)),
      map(party => party?.overallNomination),
      map(nomination => nomination?.candidates),
      map(candidates => candidates?.at(position - 1)),
      map(candidate => candidate?.name)
    );
  }

  getConstituencyResults(constituencyId: number): Observable<VotingResult[]|undefined> {
    return this.electionResult$.pipe(
      map(result => result != null
        ? result.constituencyResults
        : {}),
      map(constituencyResults => constituencyResults != null
        ? constituencyResults[constituencyId]
        : []),
    );
  }

  getCandidateNameConstituency(constituencyNumber: number, abbreviation: string, position: number): Observable<string|undefined> {
    return this.parties$.pipe(
      map(map => map.get(abbreviation)),
      map(party => party?.constituencyNominations),
      map(nominations => nominations != null
        ? nominations[constituencyNumber]
        : null),
      map(nomination => nomination?.candidates),
      map(candidates => candidates?.at(position - 1)),
      map(candidate => candidate?.name)
    );
  }

  getConstituencies(): Observable<Constituency[]> {
    return this.election$.pipe(
      map(election => election != null ? election.constituencies : []),
      map(constituencies => [...constituencies].sort(this.sortConstituencies))
    );
  }

  sortConstituencies(a: Constituency, b: Constituency): number {
    return a.number - b.number;
  }
}
