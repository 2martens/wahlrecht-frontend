import {createAction, props} from "@ngrx/store";
import {Election} from "../model/election";

export enum ActionTypes {
  LoadAllElections = '[Elections] Load All Elections',
  LoadAllElectionsFinished = '[Elections] Load All Elections Finished',

  LoadSingleElection = '[Elections] Load Single Election',
  LoadSingleElectionFinished = '[Elections] Load Single Election Finished',
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
