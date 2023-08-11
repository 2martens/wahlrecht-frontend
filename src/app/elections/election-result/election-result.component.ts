import {Component, Input} from '@angular/core';
import {Party} from "../model/party";
import {ElectedCandidates} from "../model/elected-candidates";
import {ViewModel} from "../elected-candidates/elected-candidates.component";
import {electedCandidates} from "../store";

export interface PartySeats {
  party: string;
  seats: number;
}

@Component({
  selector: 'app-election-result',
  templateUrl: './election-result.component.html',
  styleUrls: ['./election-result.component.scss']
})
export class ElectionResultComponent {

  @Input() parties: Map<string, Party>|null = null;
  @Input() electedCandidates: ElectedCandidates | null = null;

  get partyAbbreviations() {
    if (this.electedCandidates == null) {
      return null;
    }
    const electedParties: string[] = [];
    for (const party in this.electedCandidates.seatAllocation) {
      electedParties.push(party);
    }
    return electedParties;
  }

  getViewModel(partyAbbreviation: string): ViewModel|null {
    if (this.electedCandidates == null) {
      return null;
    }
    return {
      partyAbbreviation,
      electedCandidates: this.electedCandidates
    };
  }
}
