import {ElectedCandidate} from "./elected-candidate";

export interface ElectedResult {
  electedCandidates: {[name: string]: ElectedCandidate[]}
  usedElectionNumbers: number[];
}

export const DEFAULT_ELECTED_RESULT = {
  electedCandidates: {},
  usedElectionNumbers: []
}
