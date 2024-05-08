import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, concatMap, Observable, of, take } from 'rxjs';
import { StateService } from './state.service';
import { WeatherForecast } from '../models/weather-api/weather-forecast';
import { WeatherSummary } from '../models/weather-api/weather-summary';

const API_ENDPOINT = 'https://fee8-92-247-13-237.ngrok-free.app';

@Injectable({
  providedIn: 'root'
})
export class WeatherAPIService {
  constructor(
    private http: HttpClient,
    private stateService: StateService
  ) { }

  private _globalVar$!: BehaviorSubject<WeatherForecast | undefined>;

  public get globalVar(): BehaviorSubject<WeatherForecast | undefined> {
    if (!this._globalVar$) {
      this._globalVar$ = new BehaviorSubject<WeatherForecast | undefined>(undefined);
      this.stateService.id.pipe(
        concatMap(() => this.getGlobalVar(this.stateService.id.value as any).pipe(take(1)))
      ).subscribe(v => this._globalVar$.next(v));
    }
    return this._globalVar$;
  }

  private _masterVar$!: BehaviorSubject<WeatherForecast | undefined>;

  public get masterVar(): BehaviorSubject<WeatherForecast | undefined> {
    if (!this._masterVar$) {
      this._masterVar$ = new BehaviorSubject<WeatherForecast | undefined>(undefined);
      this._masterVar$.subscribe(() => this.globalVar.next(undefined));
      this.getGlobalVar(1).pipe(take(1)).subscribe(v => this._masterVar$.next(v));
    }
    return this._masterVar$;
  }

  public getWeatherForecastList(): Observable<WeatherForecast[]> {
    return this.http.get<WeatherForecast[]>(`${API_ENDPOINT}/WeatherForecast`)
      .pipe(
        catchError(this.handleError<WeatherForecast[]>('getWeatherForecastList', []))
      );
  }

  public postWeatherForecast(data: any): Observable<WeatherForecast | undefined> {
    if (!data) {
      return of(undefined);
    }
    const body = data;
    return this.http.post<WeatherForecast | undefined>(`${API_ENDPOINT}/WeatherForecast`, body).pipe(
      catchError(this.handleError<WeatherForecast | undefined>('postWeatherForecast', undefined))
    );
  }

  public putWeatherForecast(data: any): Observable<WeatherForecast | undefined> {
    if (!data) {
      return of(undefined);
    }
    const body = data;
    return this.http.put<WeatherForecast | undefined>(`${API_ENDPOINT}/WeatherForecast`, body).pipe(
      catchError(this.handleError<WeatherForecast | undefined>('putWeatherForecast', undefined))
    );
  }

  public deleteWeatherForecast(id: number): Observable<WeatherForecast | undefined> {
    if (!id) {
      return of(undefined);
    }
    return this.http.delete<WeatherForecast | undefined>(`${API_ENDPOINT}/WeatherForecast/${id}`).pipe(
      catchError(this.handleError<WeatherForecast | undefined>('deleteWeatherForecast', undefined))
    );
  }

  public getWeatherSummaryList(): Observable<WeatherSummary[]> {
    return this.http.get<WeatherSummary[]>(`${API_ENDPOINT}/WeatherSummary`).pipe(
      catchError(this.handleError<WeatherSummary[]>('getWeatherSummaryList', []))
    );
  }

  public getGlobalVar(id: number): Observable<WeatherForecast | undefined> {
    if (!id) {
      return of(undefined);
    }
    return this.http.get<WeatherForecast | undefined>(`${API_ENDPOINT}/WeatherForecast/${id}`).pipe(
      catchError(this.handleError<WeatherForecast | undefined>('getGlobalVar', undefined))
    );
  }

  /**
  * Handle Http operation that failed.
  * Let the app continue.
  *
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
