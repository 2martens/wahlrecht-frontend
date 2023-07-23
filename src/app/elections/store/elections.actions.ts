import {createAction, props} from "@ngrx/store";
import {Election} from "../model/election";
import {ElectionResult} from "../model/election-result";
import {Party} from "../model/party";

export enum ActionTypes {
  LoadAllElections = '[Elections] Load All Elections',
  LoadAllElectionsFinished = '[Elections] Load All Elections Finished',

  LoadSingleElection = '[Elections] Load Single Election',
  LoadSingleElectionFinished = '[Elections] Load Single Election Finished',

  LoadElectionResult = '[Elections] Load Election Result',
  LoadElectionResultFinished = '[Elections] Load Election Result Finished',

  LoadParties = '[Elections] Load Parties',
  LoadPartiesFinished = '[Elections] Load Parties Finished',
}

export const loadAllElectionsAction = createAction(
    ActionTypes.LoadAllElections
);

export const loadAllElectionsFinishedAction = createAction(
    ActionTypes.LoadAllElectionsFinished,
    props<{payload: Election[]}>()
);

export const loadSingleElectionAction = createAction(
    ActionTypes.LoadSingleElection,
    props<{payload: string}>()
);

export const loadSingleElectionFinishedAction = createAction(
    ActionTypes.LoadSingleElectionFinished,
    props<{payload: Election|undefined}>()
);

export const loadElectionResultAction = createAction(
  ActionTypes.LoadElectionResult,
  props<{payload: string}>()
);

export const loadElectionResultFinishedAction = createAction(
  ActionTypes.LoadElectionResultFinished,
  props<{payload: ElectionResult|undefined}>()
);

export const loadPartiesAction = createAction(
  ActionTypes.LoadParties,
  props<{payload: string}>()
);

export const loadPartiesFinishedAction = createAction(
  ActionTypes.LoadPartiesFinished,
  props<{payload: Party[]}>()
);
