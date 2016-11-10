import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { MuncipalityDetailsPage } from '../item-details/municipality-details';
import { Area } from "../../models/Area";

@Component({
  templateUrl: 'list.html'
})
export class FloodLandslideListPage {

  forecastType: string = 'highest';
  itemsType: string = 'county';

  pageTitle: string;
  items: Area[];
  parent: Area;
  segments: { slug: string, name: string }[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.parent = navParams.get('parent');
    this.segments = [
      { slug: 'highest', name: "Felles" },
      { slug: 'flood', name: "Flom" },
      { slug: 'landslide', name: "Jordskred" }
    ];

    if(!this.parent) {
      this.itemsType = 'county';
      this.pageTitle = 'Flom / jordskred';
    } else {
      this.itemsType = 'municipality';
      this.pageTitle = this.parent.name;
    }

    this.items = [];
    for(let i = 1; i < 30; i++) {
      let item = new Area(Number(i), this.itemsType + " " + i, this.itemsType);
      this.items.push(item);
    }
  }

  itemTapped(event, item) {
    if('municipality' == item.type) {
      this.navCtrl.push(MuncipalityDetailsPage, {
        municipality: item
      });
    } else {
      this.navCtrl.push(FloodLandslideListPage, {
        parent: item
      });
    }
  }
}
