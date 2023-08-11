import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {Party} from "../model/party";
import {ElectedCandidates} from "../model/elected-candidates";
import {MatSort, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatTableDataSource} from "@angular/material/table";

export interface PartySeats {
  party: string;
  seats: number;
}

@Component({
  selector: 'app-election-result',
  templateUrl: './election-result.component.html',
  styleUrls: ['./election-result.component.scss']
})
export class ElectionResultComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort|null = null;
  resultColumns: string[] = ['party', 'seats'];
  seatsPerParty: PartySeats[] = [];
  dataSource: MatTableDataSource<PartySeats> = new MatTableDataSource<PartySeats>();

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  @Input() parties: Map<string, Party> = new Map<string, Party>();

  private _electedCandidates: ElectedCandidates | null = null;

  get electedCandidates(): ElectedCandidates | null {
    return this._electedCandidates;
  }

  @Input() set electedCandidates(value: ElectedCandidates | null) {
    this._electedCandidates = value;
    if (value != null) {
      const newSeatAllocations = [];
      for (const partyAbbreviation in value.seatAllocation) {
        if (!this.parties.has(partyAbbreviation)) {
          continue;
        }
        newSeatAllocations.push({
          party: this.parties.get(partyAbbreviation)!.abbreviation,
          seats: value.seatAllocation[partyAbbreviation]
        })
      }
      this.seatsPerParty = newSeatAllocations;
      this.dataSource.data = this.seatsPerParty;
    }
  }

  constructor(private liveAnnouncer: LiveAnnouncer) {
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce($localize`Sorted ${sortState.direction}ending`)
    } else {
      this.liveAnnouncer.announce($localize`Sorting cleared`)
    }
  }
}
