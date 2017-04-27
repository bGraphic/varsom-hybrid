import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';
import { ForecastService } from "../../providers/forecasts";
import { Subscription } from "rxjs";
import { Warning } from "../../store/models/Warning";

@Component({
  templateUrl: 'warning-details.html'
})

export class WarningDetailsPage {
  pageTitleKey: string;
  areaId: string;
  forecastType: string;
  warning: Warning;

  private _forecastDay: number;
  private _subscription: Subscription;

  constructor(
    private _navParams: NavParams,
    private _forecastService: ForecastService
  ) {
    // If we navigated to this page, we will have an item available as a nav param
    let warningParams:{ areaName:string, areaId: string, forecastType:string, forecastDay:number } = this._navParams.get('warning');
    this.pageTitleKey = warningParams.areaName;
    this.areaId = warningParams.areaId;
    this.forecastType = warningParams.forecastType;
    this._forecastDay = warningParams.forecastDay;
  }

  ngOnInit() {
    this._subscription = this._forecastService.getForecastForArea(this.forecastType, this.areaId)
      .subscribe(forecast => {
        this.warning = forecast.getDay(this._forecastDay);
      });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
