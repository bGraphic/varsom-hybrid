import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { Forecast } from "../../models/Forecast";
import { DataService } from "../../services/data";
import { WarningDetailsPage } from "../warning-details/warning-details";
import { Subscription } from "rxjs";


@Component({
  templateUrl: 'area-details.html'
})

export class AreaDetailsPage {
  pageTitleKey: string;
  forecasts: Forecast[] = [];

  private _areaId;
  private _subscriptions: Subscription[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    let area = navParams.get('area');
    this.pageTitleKey = area.name;
    this._areaId = area.id;
  }

  ngOnInit() {
    if(DataService.isMunicipality(this._areaId)) {
      this._subscribeToMunicipalityForecasts(this._areaId);
    } else if (DataService.isRegion(this._areaId)) {
      this._subscribeToRegionForecast(this._areaId);
    } else {
      console.log("AreaDetailsPage: Only regions and municipalities has detailed page");
    }
  }

  ngOnDestroy() {
    for(let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  onWarningSelected(forecast:Forecast, dayIndex:number) {
    this.navCtrl.push(WarningDetailsPage, {
      warning: {
        areaName: forecast.areaName,
        areaId: forecast.areaId,
        forecastType: forecast.forecastType,
        forecastDay: dayIndex
      }
    });
  }

  private _subscribeToMunicipalityForecasts(areaId:string) {

    let floodSubscription = this.dataService.getForecastForArea('flood', areaId)
      .subscribe(forecast => {
        this._updateWarnings('flood', forecast);
      });

    let landslideSubscription = this.dataService.getForecastForArea('landslide', areaId)
      .subscribe(forecast => {
        this._updateWarnings('landslide', forecast);
      });

    this._subscriptions.push(floodSubscription);
    this._subscriptions.push(landslideSubscription);
  }

  private _subscribeToRegionForecast(areaId:string) {
    let subscription = this.dataService.getForecastForArea('avalanche', areaId)
      .subscribe(forecast => {
        this._updateWarnings('avalanche', forecast);
      });

    this._subscriptions.push(subscription);
  }

  private _updateWarnings(forecastType:string, forecast:Forecast) {
    this.forecasts[forecastType] = forecast;
  }
}
