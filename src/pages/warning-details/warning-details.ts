import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { DataService } from "../../services/data";
import { Subscription } from "rxjs";
import { Warning } from "../../models/Warning";


@Component({
  templateUrl: 'warning-details.html'
})

export class WarningDetailsPage {
  pageTitleKey: string;
  forecastType: string;
  warning: Warning;

  private _areaId: string;
  private _forecastDay: number;
  private _subscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    let warningParams:{ areaName:string, areaId: string, forecastType:string, forecastDay:number } = this.navParams.get('warning');
    this.pageTitleKey = warningParams.areaName;
    this._areaId = warningParams.areaId;
    this.forecastType = warningParams.forecastType;
    this._forecastDay = warningParams.forecastDay;
  }

  ngOnInit() {
    this._subscription = this.dataService.getForecastForArea(this.forecastType, this._areaId)
      .subscribe(forecast => {
        this.warning = forecast.getDay(this._forecastDay);
      });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
