import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DEFAULT_ELECTION, Election} from "../model/election";
import {KeyValue, KeyValuePipe, NgFor, NgIf} from "@angular/common";
import {Party} from "../model/party";
import {VotingResult} from "../model/voting-result";
import {Constituency} from "../model/constituency";
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {
  DEFAULT_MODIFIED_RESULT,
  ModifiedElectionResult,
  ViewModel
} from "../election-container/election-container.component";
import {ElectionResult} from "../model/election-result";
import {FormElectionResult} from "../model/form-election-result";
import {ElectedCandidates} from "../model/elected-candidates";
import {mapConstituencyResultsForm, mapOverallResultsForm} from "../store/elections.reducer";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {MatTabsModule} from "@angular/material/tabs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ElectionResultComponent} from "../election-result/election-result.component";

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.scss'],
  imports: [MatTabsModule, MatProgressSpinnerModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, KeyValuePipe, ElectionResultComponent, NgFor, NgIf],
  standalone: true
})
export class ElectionComponent implements OnInit {
  form: FormGroup;
  overallResults: FormGroup;
  constituencyResults: FormGroup;
  showSpinner = false;
  constituencyToId: Map<number, Constituency> = new Map<number, Constituency>();
  constituencyNumberToName: Map<string, string> = new Map<string, string>();
  @ViewChild('calculateButton') calculateButton: HTMLButtonElement | undefined;

  @Output()
  readonly valueChanges: EventEmitter<FormElectionResult> = new EventEmitter<FormElectionResult>();
  @Output()
  readonly calculate: EventEmitter<ElectionResult> = new EventEmitter<ElectionResult>();
  @Output()
  readonly reset: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder) {
    this.overallResults = this.fb.group({});
    this.constituencyResults = this.fb.group({});
    this.form = this.fb.group({
      overallResults: this.overallResults,
      constituencyResults: this.constituencyResults
    });
    this._viewModel = {
      election: DEFAULT_ELECTION,
      electionResult: DEFAULT_MODIFIED_RESULT,
      parties: new Map<string, Party>()
    };
  }

  private _electedCandidates: ElectedCandidates | null = null;

  get electedCandidates(): ElectedCandidates | null {
    return this._electedCandidates;
  }

  @Input() set electedCandidates(value: ElectedCandidates | null) {
    this._electedCandidates = value;
    if (value != null) {
      this.showSpinner = false;
      if (this.calculateButton != undefined) {
        this.calculateButton.disabled = false;
      }
    }
  }

  private _viewModel: ViewModel;

  get viewModel() {
    return this._viewModel;
  }

  @Input()
  set viewModel(data: ViewModel) {
    this._viewModel = data;
    const constituencyToId = new Map<number, Constituency>();
    const constituencyNumberToName = new Map<string, string>();
    data.election?.constituencies.forEach(constituency => {
      constituencyToId.set(constituency.number, constituency);
      constituencyNumberToName.set(constituency.name, constituency.number.toString());
    })
    this.constituencyToId = constituencyToId;
    this.constituencyNumberToName = constituencyNumberToName;
    this.updateForm(data.electionResult);
  }

  ngOnInit() {
    this.setUpForm(this.viewModel.election, this.viewModel.electionResult);
  }

  keyAscOrder = (a: KeyValue<string, number>, b: KeyValue<string, number>): number => {
    return +a.key < +b.key ? -1 : (+a.key > +b.key ? 1 : 0);
  }

  getCandidateNameOverall(abbreviation: string, position: number): string | undefined {
    return this.viewModel.parties.get(abbreviation)?.overallNomination
      ?.candidates.at(position - 1)?.name;
  }

  getConstituencyResults(constituencyId: number): VotingResult[] | undefined {
    return this.viewModel.electionResult.constituencyResults.get(`${constituencyId}`);
  }

  getCandidateNameConstituency(constituencyNumber: number, abbreviation: string, position: number): string | undefined {
    return this.viewModel.parties.get(abbreviation)?.constituencyNominations[constituencyNumber]
      .candidates.at(position - 1)?.name;
  }

  getConstituencies(): Constituency[] {
    return [...this.viewModel.election.constituencies].sort(this.sortConstituencies);
  }

  sortConstituencies(a: Constituency, b: Constituency): number {
    return a.number - b.number;
  }

  onCalculate() {
    let electionResult: ElectionResult | null;
    const modifiedElectionResult = this.viewModel.electionResult;
    const result: { [name: string]: VotingResult[] } = {};
    for (const entry of modifiedElectionResult.constituencyResults.entries()) {
      result[entry[0]] = entry[1];
    }
    electionResult = {
      electionName: modifiedElectionResult.electionName,
      constituencyResults: result,
      overallResults: modifiedElectionResult.overallResults
    }
    this.showSpinner = true;
    if (this.calculateButton != undefined) {
      this.calculateButton.disabled = true;
    }
    this.calculate.emit(electionResult);
  }

  onReset() {
    this.reset.emit(true);
  }

  private updateForm(electionResult: ModifiedElectionResult) {
    for (const votingResult of electionResult.overallResults) {
      const formGroup = this.overallResults.get(votingResult.partyAbbreviation);
      formGroup?.get('votesOnNomination')?.setValue(votingResult.votesOnNomination, {emitEvent: false});
      formGroup?.get('votesThroughHealing')?.setValue(votingResult.votesThroughHealing, {emitEvent: false});
      const votesPerPosition = formGroup?.get('votesPerPosition');
      const {map, entries} = this.buildVotesPerPosition(votingResult);
      for (const number of entries) {
        votesPerPosition?.get(number)?.setValue(map.get(number) || 0, {emitEvent: false});
      }
    }
    for (const constituencyNumber of electionResult.constituencyResults.keys()) {
      const constituency = this.constituencyToId.get(+constituencyNumber);
      const votingResults = electionResult.constituencyResults.get(constituencyNumber);
      if (constituency == null || votingResults == null) {
        continue;
      }

      const constituencyFormGroup = this.constituencyResults.get(constituency.name);

      for (const votingResult of votingResults) {
        const formGroup = constituencyFormGroup?.get(votingResult.partyAbbreviation);
        const votesPerPosition = formGroup?.get('votesPerPosition');
        for (const number in votingResult.votesPerPosition) {
          votesPerPosition?.get(number)?.setValue(votingResult.votesPerPosition[number], {emitEvent: false});
        }
      }
    }
  }

  private setUpForm(election: Election, electionResult: ModifiedElectionResult) {
    this.overallResults = this.fb.group({});
    this.constituencyResults = this.fb.group({});
    this.form = this.fb.group({
      overallResults: this.overallResults,
      constituencyResults: this.constituencyResults
    });
    for (const votingResult of electionResult.overallResults) {
      const votesPerPosition = this.fb.group({});
      const formGroup = this.fb.group({
        votesOnNomination: this.fb.control<number>(votingResult.votesOnNomination),
        votesThroughHealing: this.fb.control<number>(votingResult.votesThroughHealing),
        votesPerPosition: votesPerPosition,
        electionName: this.fb.control<string>(votingResult.electionName),
        partyAbbreviation: this.fb.control<string>(votingResult.partyAbbreviation),
        nominationName: this.fb.control<string>(votingResult.nominationName),
      });
      const {map, entries} = this.buildVotesPerPosition(votingResult);
      for (const number of entries) {
        votesPerPosition.addControl(number, this.fb.control<number>(map.get(number) || 0));
      }

      this.overallResults.addControl(votingResult.partyAbbreviation, formGroup);
    }
    for (const constituencyNumber of electionResult.constituencyResults.keys()) {
      const constituencyFormGroup = this.fb.group({});
      const votingResults = electionResult.constituencyResults.get(constituencyNumber);
      if (votingResults == null) {
        continue;
      }
      for (const votingResult of votingResults) {
        const votesPerPosition = this.fb.group({});
        const formGroup = this.fb.group({
          votesPerPosition: votesPerPosition,
          electionName: this.fb.control<string>(votingResult.electionName),
          partyAbbreviation: this.fb.control<string>(votingResult.partyAbbreviation),
          nominationName: this.fb.control<string>(votingResult.nominationName),
        });
        for (const number in votingResult.votesPerPosition) {
          votesPerPosition.addControl(number, this.fb.control<number>(votingResult.votesPerPosition[number]));
        }
        constituencyFormGroup.addControl(votingResult.partyAbbreviation, formGroup);
      }
      const constituency = this.constituencyToId.get(+constituencyNumber);
      if (constituency != null) {
        this.constituencyResults.addControl(
          constituency.name,
          constituencyFormGroup);
      }
    }
    this.form.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe({
      next: (value: {
        overallResults: { [name: string]: VotingResult },
        constituencyResults: { [name: string]: { [name: string]: VotingResult } }
      }) => {
        const modifiedValue: FormElectionResult = {
          ...value,
          constituencyResults: {}
        };
        for (const name in value.constituencyResults) {
          modifiedValue.constituencyResults[this.constituencyNumberToName.get(name)!] = value.constituencyResults[name];
        }

        this.viewModel.electionResult.overallResults = mapOverallResultsForm(value.overallResults);
        const map = new Map<string, VotingResult[]>();
        const modifiedConstituencyResults = mapConstituencyResultsForm(modifiedValue.constituencyResults);
        for (const number in modifiedConstituencyResults) {
          map.set(number, modifiedConstituencyResults[number]);
        }
        this.viewModel.electionResult.constituencyResults = map;
        this.valueChanges.emit(modifiedValue);
      }
    });
  }

  private buildVotesPerPosition(votingResult: VotingResult) {
    const map = new Map<string, number>();
    for (const number in votingResult.votesPerPosition) {
      map.set(number, votingResult.votesPerPosition[number]);
    }
    const entries = [...map.entries()]
      .sort((a, b) => {
        return +a[0] - +b[0];
      })
      .map(entry => entry[0]);
    return {map, entries};
  }
}
