import {Candidate} from "./candidate";
import {ElectionSource} from "./election-source";

export interface ElectedCandidate {
  candidate: Candidate;
  elected: ElectionSource;
}
