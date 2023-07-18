import {createAction, props} from "@ngrx/store";
import {Message} from "../model/message";

export enum ActionTypes {
  AddMessage = '[Messages] Add Message',
  AddMessageFinished = '[Messages] Add Message Finished',
}

export const addMessageAction = createAction(
    ActionTypes.AddMessage,
    props<{message: Message}>()
);

export const addMessageFinishedAction = createAction(
    ActionTypes.AddMessageFinished
);
