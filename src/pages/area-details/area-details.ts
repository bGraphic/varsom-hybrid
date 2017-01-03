import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { AreaUtils } from "../../utils/area-utils";
import { Forecast } from "../../models/Forecast";
import { ForecastService } from "../../providers/forecasts";
import { WarningDetailsPage } from "../warning-details/warning-details";
import { Subscription } from "rxjs";


@Component({
  templateUrl: 'area-details.html'
})

export class AreaDetailsPage {
  pageTitleKey: string;
  areaId: string;
  forecasts: Forecast[] = [];

  private _subscriptions: Subscription[] = [];

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _forecastService: ForecastService
  ) {
    // If we navigated to this page, we will have an item available as a nav param
    let area = _navParams.get('area');
    this.pageTitleKey = area.name;
    this.areaId = area.id;
  }

  ngOnInit() {
    if(AreaUtils.isMunicipality(this.areaId)) {
      this._subscribeToMunicipalityForecasts(this.areaId);
    } else if (AreaUtils.isRegion(this.areaId)) {
      this._subscribeToRegionForecast(this.areaId);
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
    this._navCtrl.push(WarningDetailsPage, {
      warning: {
        areaName: forecast.areaName,
        areaId: forecast.areaId,
        forecastType: forecast.forecastType,
        forecastDay: dayIndex
      }
    });
  }

  private _subscribeToMunicipalityForecasts(areaId:string) {

    let floodSubscription = this._forecastService.getForecastForArea('flood', areaId)
      .subscribe(forecast => {
        this._updateWarnings('flood', forecast);
      });

    let landslideSubscription = this._forecastService.getForecastForArea('landslide', areaId)
      .subscribe(forecast => {
        this._updateWarnings('landslide', forecast);
      });

    this._subscriptions.push(floodSubscription);
    this._subscriptions.push(landslideSubscription);
  }

  private _subscribeToRegionForecast(areaId:string) {
    let subscription = this._forecastService.getForecastForArea('avalanche', areaId)
      .subscribe(forecast => {
        this._updateWarnings('avalanche', forecast);
      });

    this._subscriptions.push(subscription);
  }

  private _updateWarnings(forecastType:string, forecast:Forecast) {
    this.forecasts[forecastType] = forecast;
  }
}
