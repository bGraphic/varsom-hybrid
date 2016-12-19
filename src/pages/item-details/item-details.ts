import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { Warning} from "../../models/Warning";
import { Forecast} from "../../models/Forecast";
import { DataService } from "../../services/data";


@Component({
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  pageTitleKey: string;
  warningsMap = {
    flood: <Warning[]>[],
    landslide: <Warning[]>[]
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    let areaId = navParams.get('forecast').areaId;

    dataService.getForecastForArea('flood', areaId)
      .subscribe(forecast => {
        this.pageTitleKey = forecast.areaName;
        this._updateWarnings('flood', forecast.warnings);
      });

    dataService.getForecastForArea('landslide', areaId)
      .subscribe(forecast => {
        this.pageTitleKey = forecast.areaName;
        this._updateWarnings('landslide', forecast.warnings);
      });

  }

  private _updateWarnings(forecastType:string, warnings:Warning[]) {
    this.warningsMap[forecastType] = warnings;
  }
}
