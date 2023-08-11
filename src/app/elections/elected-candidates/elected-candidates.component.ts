import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {ElectedCandidates} from "../model/elected-candidates";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {ElectionSource} from "../model/election-source";

export interface ViewModel {
  electedCandidates: ElectedCandidates;
  partyAbbreviation: string;
}

interface PresentedCandidate {
  name: string;
  profession: string;
  elected: string;
}

@Component({
  selector: 'app-elected-candidates',
  templateUrl: './elected-candidates.component.html',
  styleUrls: ['./elected-candidates.component.scss']
})
export class ElectedCandidatesComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort | null = null;
  resultColumns: string[] = ['name', 'profession', 'elected'];
  electedCandidatesOfParty: PresentedCandidate[] = [];
  dataSource: MatTableDataSource<PresentedCandidate> = new MatTableDataSource<PresentedCandidate>();

  constructor(private liveAnnouncer: LiveAnnouncer) {
  }

  private _viewModel: ViewModel | null = null;

  get viewModel(): ViewModel | null {
    return this._viewModel;
  }

  @Input() set viewModel(value: ViewModel | null) {
    if (value != null) {
      this._viewModel = value;
      const electedCandidates: PresentedCandidate[] = [];
      const overallCandidates = this._viewModel.electedCandidates.overallResult.electedCandidates;
      if (this._viewModel.partyAbbreviation in overallCandidates) {
        electedCandidates.push(
          ...overallCandidates[this._viewModel.partyAbbreviation].map(
            candidate => {
              return {
                name: candidate.candidate.name,
                profession: candidate.candidate.profession,
                elected: this.getElectedMessage((<any>ElectionSource)[candidate.elected])
              };
            }
          )
        );
      }
      for (const constituency in this._viewModel.electedCandidates.constituencyResults) {
        const electedResult = this._viewModel.electedCandidates.constituencyResults[constituency];
        if (this._viewModel.partyAbbreviation in electedResult.electedCandidates) {
          electedCandidates.push(
            ...electedResult.electedCandidates[this._viewModel.partyAbbreviation].map(
              candidate => {
                return {
                  name: candidate.candidate.name,
                  profession: candidate.candidate.profession,
                  elected: this.getElectedMessage((<any>ElectionSource)[candidate.elected])
                };
              }
            )
          );
        }
      }
      this.electedCandidatesOfParty = electedCandidates;
      this.dataSource.data = this.electedCandidatesOfParty;
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce($localize`Sorted ${sortState.direction}ending`)
    } else {
      this.liveAnnouncer.announce($localize`Sorting cleared`)
    }
  }

  getElectedMessage(elected: ElectionSource): string {
    switch(elected) {
      case ElectionSource.NOT_ELECTED:
        return $localize`Not elected`;
      case ElectionSource.CONSTITUENCY:
        return $localize`Constituency list vote order`;
      case ElectionSource.OVERALL_NOMINATION_ORDER:
        return $localize`District list position order`;
      case ElectionSource.OVERALL_VOTE_ORDER:
        return $localize`District list vote order`;
      default:
        console.error(elected);
        return 'oops';
    }
  }
}
