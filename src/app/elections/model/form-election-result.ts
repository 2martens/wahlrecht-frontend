import {VotingResult} from "./voting-result";

export interface FormElectionResult {
  overallResults: {[name: string]: VotingResult},
  constituencyResults: {[name: string]: {[name: string]: VotingResult}};
}
