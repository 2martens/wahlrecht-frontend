import {Injectable} from '@angular/core';
import {SwUpdate} from "@angular/service-worker";
import {MessagesService} from "./messages.service";
import {MessageType} from "./model/message-type";

@Injectable()
export class ServiceWorkerService {

  constructor(updates: SwUpdate, messages: MessagesService) {
    updates.unrecoverable.subscribe(event => {
      messages.logMessage("service-worker", MessageType.SERVICE_WORKER_ERROR, event.reason);
    });
  }
}
