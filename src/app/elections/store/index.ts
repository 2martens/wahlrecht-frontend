import {electionsReducer, ReducerElectionsState} from "./elections.reducer";
import {ActionReducerMap, createFeatureSelector, createSelector} from "@ngrx/store";

export const featureStateName = 'electionsFeature';

export interface ElectionsState {
  elections: ReducerElectionsState;
}

export const electionsReducers: ActionReducerMap<ElectionsState> = {
  elections: electionsReducer,
};

// extract the main property 'electionsFeature' from the state object
export const getElectionsFeatureState = createFeatureSelector<ElectionsState>(
    featureStateName
);

export const allElections = () => createSelector(
    getElectionsFeatureState,
    (state: ElectionsState) => state.elections.items
);

export const electionByName = (name: string) => createSelector(
    getElectionsFeatureState,
    (state: ElectionsState) =>
        state.elections.items?.find(election => election.name === name)
);

export const selectedElection = () => createSelector(
  getElectionsFeatureState,
  (state: ElectionsState) =>
    state.elections.selectedItem
);

export const originalElectionResult = () => createSelector(
  getElectionsFeatureState,
  (state: ElectionsState) =>
    state.elections.originalElectionResult
);

export const modifiedElectionResult = () => createSelector(
  getElectionsFeatureState,
  (state: ElectionsState) =>
    state.elections.modifiedElectionResult
);

export const selectedParties = () => createSelector(
  getElectionsFeatureState,
  (state: ElectionsState) =>
    state.elections.selectedParties
);

export const electedCandidates = () => createSelector(
  getElectionsFeatureState,
  (state: ElectionsState) => state.elections.electedCandidates
)
