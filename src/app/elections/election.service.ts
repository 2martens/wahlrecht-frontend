import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Election} from "./model/election";
import {catchError, Observable, of} from "rxjs";
import {MessagesService} from "../messages/messages.service";
import {MessageType} from "../messages/model/message-type";
import {ElectionResult} from "./model/election-result";
import {Party} from "./model/party";
import {ElectedCandidates} from "./model/elected-candidates";

@Injectable({
  providedIn: 'root'
})
export class ElectionService {

  private calculateURL = environment.backendURL + '/calculate';
  private electionsURL = environment.backendURL + '/elections';
  private electionResultURL = environment.backendURL + '/electionResult/by-election-name/';
  private electionURL = environment.backendURL + '/elections/by-name/';
  private partiesURL = environment.backendURL + '/parties/by-election-name/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,
              private messageService: MessagesService) { }

  calculateElectionResult(electionResult: ElectionResult): Observable<ElectedCandidates> {
    return this.http.post<ElectedCandidates>(this.calculateURL, electionResult, this.httpOptions)
      .pipe(
        catchError(this.handleError<ElectedCandidates>('calculateElectionResult', undefined))
      );
  }

  fetchElections(): Observable<Election[]> {
    return this.http.get<Election[]>(this.electionsURL, this.httpOptions)
      .pipe(
        catchError(this.handleError<Election[]>('fetchElections', []))
      );
  }

  fetchParties(electionName: string): Observable<Party[]> {
    return this.http.get<Party[]>(`${this.partiesURL}${electionName}`, this.httpOptions)
      .pipe(
        catchError(this.handleError<Party[]>('fetchParties', []))
      );
  }

  fetchElectionResult(electionName: string): Observable<ElectionResult> {
    return this.http.get<ElectionResult>(`${this.electionResultURL}${electionName}`, this.httpOptions)
      .pipe(
        catchError(this.handleError<ElectionResult>('fetchElectionResult', undefined))
      );
  }

  fetchElection(name: string) {
    return this.http.get<Election>(`${this.electionURL}${name}`, this.httpOptions)
      .pipe(
        catchError(this.handleError<Election>('fetchElection', undefined))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      if (error.status == 401) {
        this.log(MessageType.UNAUTHENTICATED);
      }
      if (error.status == 403) {
        this.log(MessageType.UNAUTHORIZED);
      }
      if (error.status == 500) {
        this.log(MessageType.INTERNAL_SERVER_ERROR);
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(type: MessageType) {
    this.messageService.logMessage('ElectionService', type);
  }
}
