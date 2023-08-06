import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DEFAULT_ELECTION, Election} from "../model/election";
import {KeyValue} from "@angular/common";
import {Party} from "../model/party";
import {VotingResult} from "../model/voting-result";
import {Constituency} from "../model/constituency";
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {
  DEFAULT_MODIFIED_RESULT,
  ModifiedElectionResult,
  ViewModel
} from "../election-container/election-container.component";
import {ElectionResult} from "../model/election-result";
import {FormElectionResult} from "../model/form-election-result";
import {ElectedCandidates} from "../model/elected-candidates";
import {mapConstituencyResultsForm, mapOverallResultsForm} from "../store/elections.reducer";

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.scss']
})
export class ElectionComponent implements OnInit {
  form: FormGroup;
  overallResults: FormGroup;
  constituencyResults: FormGroup;
  resultColumns: string[] = ['party', 'seats'];
  seatsPerParty: {party: Party, seats: number}[] = [];
  @Output()
  readonly valueChanges: EventEmitter<FormElectionResult> = new EventEmitter<FormElectionResult>();
  @Output()
  readonly calculate: EventEmitter<ElectionResult> = new EventEmitter<ElectionResult>();

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
      const newSeatAllocations = [];
      for (const partyAbbreviation in value.seatAllocation) {
        if (!this.viewModel.parties.has(partyAbbreviation)) {
          continue;
        }
        newSeatAllocations.push({
          party: this.viewModel.parties.get(partyAbbreviation)!,
          seats: value.seatAllocation[partyAbbreviation]
        })
      }
      this.seatsPerParty = newSeatAllocations;
    }
  }

  private _viewModel: ViewModel;

  get viewModel() {
    return this._viewModel;
  }

  @Input()
  set viewModel(data: ViewModel) {
    this._viewModel = data;
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
    this.calculate.emit(electionResult);
  }

  private setUpForm(election: Election, electionResult: ModifiedElectionResult) {
    const constituencies = new Map<number, Constituency>();
    election?.constituencies.forEach(constituency => {
      constituencies.set(constituency.number, constituency);
    })
    this.overallResults = this.fb.group({});
    this.constituencyResults = this.fb.group({});
    this.form = this.fb.group({
      overallResults: this.overallResults,
      constituencyResults: this.constituencyResults
    });
    for (const votingResult of electionResult.overallResults) {
      const votesPerPosition = this.fb.array<FormControl<number | null>>([]);
      const formGroup = this.fb.group({
        votesOnNomination: this.fb.control<number>(votingResult.votesOnNomination),
        votesThroughHealing: this.fb.control<number>(votingResult.votesThroughHealing),
        votesPerPosition: votesPerPosition,
        electionName: this.fb.control<string>(votingResult.electionName),
        partyAbbreviation: this.fb.control<string>(votingResult.partyAbbreviation),
        nominationName: this.fb.control<string>(votingResult.nominationName),
      });
      const map = new Map<string, number>();
      for (const number in votingResult.votesPerPosition) {
        map.set(number, votingResult.votesPerPosition[number]);
      }
      const entries = [...map.entries()]
        .sort((a, b) => {
          return +a[0] - +b[0];
        })
        .map(entry => entry[0]);
      for (const number of entries) {
        votesPerPosition.push(this.fb.control<number>(map.get(number) || 0));
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
        const votesPerPosition = this.fb.array<FormControl<number | null>>([]);
        const formGroup = this.fb.group({
          votesPerPosition: votesPerPosition,
          electionName: this.fb.control<string>(votingResult.electionName),
          partyAbbreviation: this.fb.control<string>(votingResult.partyAbbreviation),
          nominationName: this.fb.control<string>(votingResult.nominationName),
        });
        for (const number in votingResult.votesPerPosition) {
          votesPerPosition.push(this.fb.control<number>(votingResult.votesPerPosition[number]));
        }
        constituencyFormGroup.addControl(votingResult.partyAbbreviation, formGroup);
      }
      const constituency = constituencies.get(+constituencyNumber);
      if (constituency != null) {
        this.constituencyResults.addControl(
          constituency.name,
          constituencyFormGroup);
      }
    }
    this.form.valueChanges.subscribe({
      next: (value: {
        overallResults: { [name: string]: VotingResult },
        constituencyResults: { [name: string]: { [name: string]: VotingResult } }
      }) => {
        this.viewModel.electionResult.overallResults = mapOverallResultsForm(value.overallResults);
        const map = new Map<string, VotingResult[]>();
        const modifiedConstituencyResults = mapConstituencyResultsForm(value.constituencyResults);
        for (const name in modifiedConstituencyResults) {
          map.set(name, modifiedConstituencyResults[name]);
        }
        this.viewModel.electionResult.constituencyResults = map;

        this.valueChanges.emit(value);
      }
    });
  }
}
