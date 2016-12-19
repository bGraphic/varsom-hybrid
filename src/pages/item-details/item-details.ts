import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { Warning} from "../../models/Warning";
import { DataService } from "../../services/data";


@Component({
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  pageTitleKey: string;
  warningsMap = {
    flood: <Warning[]>[],
    landslide: <Warning[]>[],
    avalanche: <Warning[]>[]
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    let area = navParams.get('area');
    this.pageTitleKey = area.name;

    if(DataService.isMunicipality(area.id)) {
      this._subscribeToMunicipalityForecasts(area.id);
    } else if (DataService.isRegion(area.id)) {
      this._subscribeToRegionForecast(area.id);
    } else {
      console.log("ItemDetailsPage: Only regions and municiplaities has detailed page");
    }
  }

  private _subscribeToMunicipalityForecasts(areaId:string) {
    this.dataService.getForecastForArea('flood', areaId)
      .subscribe(forecast => {
        this._updateWarnings('flood', forecast.warnings);
      });

    this.dataService.getForecastForArea('landslide', areaId)
      .subscribe(forecast => {
        this._updateWarnings('landslide', forecast.warnings);
      });
  }

  private _subscribeToRegionForecast(areaId:string) {
    this.dataService.getForecastForArea('avalanche', areaId)
      .subscribe(forecast => {
        this._updateWarnings('avalanche', forecast.warnings);
      });
  }

  private _updateWarnings(forecastType:string, warnings:Warning[]) {
    this.warningsMap[forecastType] = warnings;
  }
}
