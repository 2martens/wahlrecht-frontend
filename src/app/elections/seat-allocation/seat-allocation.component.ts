import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {MatSort, MatSortModule, Sort} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {PartySeats} from "../election-result/election-result.component";
import {ElectedCandidates} from "../model/elected-candidates";
import {Party} from "../model/party";
import {LiveAnnouncer} from "@angular/cdk/a11y";

@Component({
  selector: 'app-seat-allocation',
  templateUrl: './seat-allocation.component.html',
  styleUrls: ['./seat-allocation.component.scss'],
  imports: [MatTableModule, MatSortModule],
  standalone: true
})
export class SeatAllocationComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort|null = null;
  resultColumns: string[] = ['party', 'seats'];
  seatsPerParty: PartySeats[] = [];
  dataSource: MatTableDataSource<PartySeats> = new MatTableDataSource<PartySeats>();

  @Input() parties: Map<string, Party>|null = null;

  constructor(private liveAnnouncer: LiveAnnouncer) {
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

  private _electedCandidates: ElectedCandidates | null = null;

  get electedCandidates(): ElectedCandidates | null {
    return this._electedCandidates;
  }

  @Input() set electedCandidates(value: ElectedCandidates | null) {
    this._electedCandidates = value;
    if (value != null) {
      const newSeatAllocations = [];
      for (const partyAbbreviation in value.seatAllocation) {
        if (!this.parties!.has(partyAbbreviation)) {
          continue;
        }
        newSeatAllocations.push({
          party: this.parties!.get(partyAbbreviation)!.abbreviation,
          seats: value.seatAllocation[partyAbbreviation]
        })
      }
      this.seatsPerParty = newSeatAllocations;
      this.dataSource.data = this.seatsPerParty;
    }
  }
}
