import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WeatherAPIService } from './weather-api.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor(
    private weatherAPIService: WeatherAPIService
  ) { }

  private _id$!: BehaviorSubject<number | undefined>;

  public get id(): BehaviorSubject<number | undefined> {
    if (!this._id$) {
      this._id$ = new BehaviorSubject<number | undefined>(5);
      this._id$.subscribe(() => this.weatherAPIService.globalVar.next(undefined));
    }
    return this._id$;
  }
}
