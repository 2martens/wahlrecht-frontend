import {VotingResult} from "./voting-result";

export interface ElectionResult {
  electionName: string;
  overallResults: VotingResult[],
  constituencyResults: {[name: string]: VotingResult[]};
}

export const DEFAULT_RESULT: ElectionResult = {
  electionName: "",
  overallResults: [],
  constituencyResults: {}
}
