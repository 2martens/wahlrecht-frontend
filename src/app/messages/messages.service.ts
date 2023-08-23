import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {addMessageAction} from "./store/messages.actions";
import {MessageType} from "./model/message-type";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private static UNAUTHENTICATED = $localize`You are not logged in which prevents data from loading`;
  private static UNAUTHORIZED = $localize`You don't have sufficient authorization to view the data`;
  private static INTERNAL_SERVER_ERROR = $localize`An internal server error occurred. Sorry for the inconvenience.`;
  private static UNKNOWN_ERROR = $localize`An unknown error occurred. Sorry for the inconvenience.`;
  private static SERVICE_WORKER_ERROR = $localize`An error with the service worker occurred. Please reload the page.`

  constructor(private store: Store) {
  }

  logMessage(component: string, type: MessageType, details?: string) {
    let text = component + ": ";
    switch (type) {
      case MessageType.UNAUTHENTICATED:
        text += MessagesService.UNAUTHENTICATED;
        break;
      case MessageType.UNAUTHORIZED:
        text += MessagesService.UNAUTHORIZED;
        break;
      case MessageType.INTERNAL_SERVER_ERROR:
        text += MessagesService.INTERNAL_SERVER_ERROR;
        break;
      case MessageType.SERVICE_WORKER_ERROR:
        text += MessagesService.SERVICE_WORKER_ERROR;
        if (details != undefined) {
          text += "Details: " + details;
        }
        break;
      default:
        text += MessagesService.UNKNOWN_ERROR;
    }
    this.store.dispatch(addMessageAction({message: {text, type}}))
  }
}
