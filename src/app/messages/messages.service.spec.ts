import {TestBed} from '@angular/core/testing';

import {MessagesService} from './messages.service';
import {provideMockStore} from "@ngrx/store/testing";

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore()
      ]
    });
    service = TestBed.inject(MessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
