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
      constituencyResults: mapConstituencyResultsForm(action.payload.constituencyResults),
      electionName: state.originalElectionResult.electionName,
      overallResults: mapOverallResultsForm(action.payload.overallResults)
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

function mapConstituencyResultsForm(results: { [name: string]: {[name: string]: VotingResult} }): { [name: string]: VotingResult[] } {
  const result: { [name: string]: VotingResult[] } = {};
  for (const number in results) {
    result[number] = []
    const constituencyResult = results[number];
    for (const abbreviation in constituencyResult) {
      const partyResult = constituencyResult[abbreviation];
      result[number].push({...partyResult, votesOnNomination: 0, votesThroughHealing: 0});
    }
  }
  return result;
}

function mapOverallResultsForm(results: {[name: string]: VotingResult}) : VotingResult[] {
  const result: VotingResult[] = [];
  for (const number in results) {
    const partyResult = results[number];
    result.push({...partyResult});
  }
  return result;
}
