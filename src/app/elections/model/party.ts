import {Nomination} from "./nomination";

export interface Party {
  electionName: string;
  abbreviation: string;
  name: string;
  overallNomination: Nomination;
  constituencyNominations: {[name: string]: Nomination};
}
