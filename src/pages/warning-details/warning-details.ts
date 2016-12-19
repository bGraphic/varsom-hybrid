import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { Warning} from "../../models/Warning";
import { DataService } from "../../services/data";


@Component({
  templateUrl: 'warning-details.html'
})

export class WarningDetailsPage {
  pageTitleKey: string;
  forecastTypeKey: string;
  warning: Warning;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    let area = navParams.get('area');
    let warning = navParams.get('warning');
    this.pageTitleKey = area.name;
    this.forecastTypeKey = warning.forecastType.toUpperCase();

    this.dataService.getForecastForArea(warning.forecastType, area.id)
      .subscribe(forecast => {
        if(forecast) {
          this.warning = forecast.getDay(warning.dayIndex);
        }
      });
  }
}
