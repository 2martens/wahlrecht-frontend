import {Election} from "../model/election";
import {
  loadAllElectionsFinishedAction, loadElectionResultFinishedAction, loadPartiesFinishedAction,
  loadSingleElectionFinishedAction
} from "./elections.actions";
import {createReducer, on} from "@ngrx/store";
import {ElectionResult} from "../model/election-result";
import {Party} from "../model/party";

export interface ReducerElectionsState {
  items: Election[];
  selectedItem: Election | undefined;
  selectedElectionResult: ElectionResult | undefined;
  selectedParties: Party[];
}

export const initialState: ReducerElectionsState = {
  items: [],
  selectedItem: undefined,
  selectedElectionResult: undefined,
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
    selectedElectionResult: action.payload
  })),
  on(loadPartiesFinishedAction, (state,
                                        action) => ({
    ...state,
    selectedParties: [...action.payload]
  }))
);
