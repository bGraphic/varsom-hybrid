import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/region-details';
import {AboutPage} from "../about/about";


@Component({
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  forecastType: string;
  items: Array<{ name: string, type: string, forecast: { type: string, warnings: { level: number }[] } }>;
  itemsType: string;
  segment: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.forecastType = navParams.get('forecastType');
    this.itemsType = navParams.get('itemsType');
    this.segment = "all";

    this.items = [];
    for(let i = 1; i < 30; i++) {
      this.items.push({
        name: this.itemsType + " " + i,
        type: this.itemsType,
        forecast: {
          type: this.forecastType,
          warnings: [ { level: Math.floor(Math.random() * 4) }, { level: Math.floor(Math.random() * 4) }, { level: Math.floor(Math.random() * 4) }]
        }
      });
    }
  }

  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }

  infoButtonTapped(event, item) {
    console.log("info");
    this.navCtrl.push(AboutPage, {
      forecastType: this.forecastType
    });
  }
}
