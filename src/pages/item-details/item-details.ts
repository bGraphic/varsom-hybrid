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
    landslide: <Warning[]>[]
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    let area = navParams.get('area');
    this.pageTitleKey = area.name;

    dataService.getForecastForArea('flood', area.id)
      .subscribe(forecast => {
        this._updateWarnings('flood', forecast.warnings);
      });

    dataService.getForecastForArea('landslide', area.id)
      .subscribe(forecast => {
        this._updateWarnings('landslide', forecast.warnings);
      });

  }

  private _updateWarnings(forecastType:string, warnings:Warning[]) {
    this.warningsMap[forecastType] = warnings;
  }
}
