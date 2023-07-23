import {DEFAULT_ELECTION, Election} from "../model/election";
import {
  loadAllElectionsFinishedAction,
  loadElectionResultFinishedAction,
  loadPartiesFinishedAction,
  loadSingleElectionFinishedAction,
  modifyElectionResultAction
} from "./elections.actions";
import {createReducer, on} from "@ngrx/store";
import {DEFAULT_RESULT, ElectionResult} from "../model/election-result";
import {Party} from "../model/party";
import {VotingResult} from "../model/voting-result";

export interface ReducerElectionsState {
  items: Election[];
  selectedItem: Election;
  originalElectionResult: ElectionResult;
  modifiedElectionResult: ElectionResult;
  selectedParties: Party[];
}

export const initialState: ReducerElectionsState = {
  items: [],
  selectedItem: DEFAULT_ELECTION,
  originalElectionResult: DEFAULT_RESULT,
  modifiedElectionResult: DEFAULT_RESULT,
  selectedParties: [],
};

export const electionsReducer = createReducer(
  initialState,
  on(loadAllElectionsFinishedAction, (state,
                                      action) => ({
    ...state,
    items: [...action.payload]
  })),
  on(loadSingleElectionFinishedAction, (state,
                                        action) => ({
    ...state,
    selectedItem: action.payload
  })),
  on(loadElectionResultFinishedAction, (state,
                                        action) => ({
    ...state,
    originalElectionResult: action.payload,
    modifiedElectionResult: {
      constituencyResults: mapConstituencyResults(action.payload.constituencyResults),
      electionName: action.payload.electionName,
      overallResults: action.payload.overallResults.map(votingResult => {
        return {...votingResult}
      })
    }
  })),
  on(modifyElectionResultAction, (state,
                                        action) => ({
    ...state,
    modifiedElectionResult: {
      constituencyResults: mapConstituencyResults(action.payload.constituencyResults),
      electionName: action.payload.electionName,
      overallResults: action.payload.overallResults.map(votingResult => {
        return {...votingResult}
      })
    }
  })),
  on(loadPartiesFinishedAction, (state,
                                        action) => ({
    ...state,
    selectedParties: [...action.payload]
  }))
);

function mapConstituencyResults(results: { [name: string]: VotingResult[] }): { [name: string]: VotingResult[] } {
  const result: { [name: string]: VotingResult[] } = {};
  for (const number in results) {
    result[number] = results[number].map(votingResult => {
      return {...votingResult}
    });
  }
  return result;
}
