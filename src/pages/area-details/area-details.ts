import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { Forecast } from "../../models/Forecast";
import { Warning} from "../../models/Warning";
import { DataService } from "../../services/data";


@Component({
  templateUrl: 'area-details.html'
})

export class AreaDetailsPage {
  pageTitleKey: string;
  forecasts: Forecast[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    let area = navParams.get('area');
    this.pageTitleKey = area.name;

    if(DataService.isMunicipality(area.id)) {
      this._subscribeToMunicipalityForecasts(area.id);
    } else if (DataService.isRegion(area.id)) {
      this._subscribeToRegionForecast(area.id);
    } else {
      console.log("AreaDetailsPage: Only regions and municipalities has detailed page");
    }
  }

  onWarningSelected(warning:Warning) {
    console.log("Warning selected");
  }

  private _subscribeToMunicipalityForecasts(areaId:string) {
    this.dataService.getForecastForArea('flood', areaId)
      .subscribe(forecast => {
        this._updateWarnings('flood', forecast);
      });

    this.dataService.getForecastForArea('landslide', areaId)
      .subscribe(forecast => {
        this._updateWarnings('landslide', forecast);
      });
  }

  private _subscribeToRegionForecast(areaId:string) {
    this.dataService.getForecastForArea('avalanche', areaId)
      .subscribe(forecast => {
        this._updateWarnings('avalanche', forecast);
      });
  }

  private _updateWarnings(forecastType:string, forecast:Forecast) {
    this.forecasts[forecastType] = forecast;
  }
}
