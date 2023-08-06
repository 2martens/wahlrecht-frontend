import {DEFAULT_ELECTED_RESULT, ElectedResult} from "./elected-result";

export interface ElectedCandidates {
  seatAllocation: {[name: string]: number};
  overallResult: ElectedResult;
  constituencyResults: {[name: string]: ElectedResult};
  electionNumbersUsedForSeatAllocation: number[]
}

export const DEFAULT_ELECTED = {
  seatAllocation: {},
  overallResult: DEFAULT_ELECTED_RESULT,
  constituencyResults: {},
  electionNumbersUsedForSeatAllocation: []
}

