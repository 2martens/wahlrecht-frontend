import {TestBed} from '@angular/core/testing';

import {ElectionService} from './election.service';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {provideMockStore} from "@ngrx/store/testing";

describe('ElectionService', () => {
  let service: ElectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideMockStore()]
    });
    service = TestBed.inject(ElectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
