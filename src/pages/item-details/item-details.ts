import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import {Forecast} from "../../models/Forecast";


@Component({
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  selectedForecast: Forecast;
  pageTitle: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedForecast = navParams.get('forecast');
    this.pageTitle = this.selectedForecast.areaName;
  }
}
