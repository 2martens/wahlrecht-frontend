import {Candidate} from "./candidate";

export interface Nomination {
  electionName: string;
  partyAbbreviation: string;
  name: string;
  supportsVotesOnNomination: boolean;
  candidates: Candidate[];
}
