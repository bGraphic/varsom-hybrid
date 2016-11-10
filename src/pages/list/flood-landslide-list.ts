import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/region-details';

const enum FloodLandslideSegment {
  Highest,
  Flood,
  Landslide
}

@Component({
  templateUrl: 'list.html'
})
export class FloodLandslideListPage {

  pageTitle: string;

  items: { id: Number, name: string, type: string, forecasts: { type: FloodLandslideSegment, warnings: { level: number }[] }[] }[];
  parent: { id: Number, name: string, type: string, forecast: { type: string, warnings: { level: number }[] } };
  itemsType: string;
  segments: { id: FloodLandslideSegment, name: string }[];
  selectedSegmentId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.parent = navParams.get('parent');
    this.segments = [
      { id: FloodLandslideSegment.Highest, name: "Felles" },
      { id: FloodLandslideSegment.Flood, name: "Flom" },
      { id: FloodLandslideSegment.Landslide, name: "Jordskred" }
    ];
    this.selectedSegmentId = "" + FloodLandslideSegment.Highest;

    if(!this.parent) {
      this.itemsType = 'county';
      this.pageTitle = 'Flom / jordskred';
    } else {
      this.itemsType = 'municipality';
      this.pageTitle = this.parent.name;
    }

    this.items = [];
    for(let i = 1; i < 30; i++) {

      let item = {
        id: Number(i),
        name: this.itemsType + " " + i,
        type: this.itemsType,
        forecasts: []
      };

      item.forecasts[FloodLandslideSegment.Highest] = {
        type: 'highest',
        warnings: [{level: Math.floor(Math.random() * 4)}, {level: Math.floor(Math.random() * 4)}, {level: Math.floor(Math.random() * 4)}]
      };
      item.forecasts[FloodLandslideSegment.Flood] = {
        type: 'flood',
        warnings: [{level: Math.floor(Math.random() * 4)}, {level: Math.floor(Math.random() * 4)}, {level: Math.floor(Math.random() * 4)}]
      };
      item.forecasts[FloodLandslideSegment.Landslide] = {
        type: 'landslide',
        warnings: [{level: Math.floor(Math.random() * 4)}, {level: Math.floor(Math.random() * 4)}, {level: Math.floor(Math.random() * 4)}]
      };

      this.items.push( item );
    }
  }

  itemTapped(event, item) {
    if('municipality' == item.type) {
      this.navCtrl.push(ItemDetailsPage, {
        region: item
      });
    } else {
      this.navCtrl.push(FloodLandslideListPage, {
        parent: item
      });
    }
  }
}
