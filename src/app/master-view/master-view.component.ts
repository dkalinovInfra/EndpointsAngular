import { Component, OnDestroy, OnInit } from '@angular/core';
import { IGridEditDoneEventArgs, IRowDataEventArgs } from '@infragistics/igniteui-angular';
import { Subject, takeUntil } from 'rxjs';
import { WeatherForecast } from '../models/weather-api/weather-forecast';
import { WeatherSummary } from '../models/weather-api/weather-summary';
import { WeatherAPIService } from '../services/weather-api.service';

@Component({
  selector: 'app-master-view',
  templateUrl: './master-view.component.html',
  styleUrls: ['./master-view.component.scss']
})
export class MasterViewComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public localVar: WeatherForecast[] = [];
  public weatherAPIWeatherForecast: WeatherForecast[] = [];
  public weatherAPIWeatherSummary: WeatherSummary[] = [];

  constructor(
    protected weatherAPIService: WeatherAPIService,
  ) {}

  ngOnInit() {
    this.weatherAPIService.getWeatherForecastList().pipe(takeUntil(this.destroy$)).subscribe(
      data => this.localVar = data
    );
    this.weatherAPIService.getWeatherForecastList().pipe(takeUntil(this.destroy$)).subscribe(
      data => this.weatherAPIWeatherForecast = data
    );
    this.weatherAPIService.getWeatherSummaryList().pipe(takeUntil(this.destroy$)).subscribe(
      data => this.weatherAPIWeatherSummary = data
    );
    this.weatherAPIService.globalVar.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.localVar = [];
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public weatherForecastRowAdded(args: IRowDataEventArgs) {
    this.weatherAPIService.postWeatherForecast(args.rowData).pipe(takeUntil(this.destroy$)).subscribe(
      _ => this.weatherAPIService.getWeatherForecastList().pipe(takeUntil(this.destroy$)).subscribe(data => this.localVar = data)
    );
  }

  public weatherForecastRowEditDone(args: IGridEditDoneEventArgs) {
    if(args.isAddRow == false) {
      this.weatherAPIService.putWeatherForecast(args.rowData).pipe(takeUntil(this.destroy$)).subscribe(
        _ => this.weatherAPIService.getWeatherForecastList().pipe(takeUntil(this.destroy$)).subscribe(data => this.localVar = data)
      );
    }
  }

  public weatherForecastRowDeleted(args: IRowDataEventArgs) {
    this.weatherAPIService.deleteWeatherForecast(args.rowKey).pipe(takeUntil(this.destroy$)).subscribe(
      _ => this.weatherAPIService.getWeatherForecastList().pipe(takeUntil(this.destroy$)).subscribe(data => this.localVar = data)
    );
  }
}
