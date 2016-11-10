import { Component, ViewChild } from '@angular/core';

import { NavController, NavParams, Content } from 'ionic-angular';

import { RegionDetailsPage } from '../item-details/region-details';

enum AvalancheSegment {
  ABregion,
  Aregion,
  Bregion
}

@Component({
  templateUrl: 'list.html'
})
export class AvalancheListPage {

  @ViewChild(Content) content: Content;

  forecastType: string = "avalanche";
  pageTitle: string;
  lists: { id: Number, name: string, type: string, forecast: { warnings: { level: number }[] } }[][]
  itemsType: string;
  segments: { id: AvalancheSegment, name: string }[];
  selectedSegmentId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.pageTitle = 'Snøskred';
    this.itemsType = 'Region';
    this.segments = [
      { id: AvalancheSegment.ABregion, name: "Felles" },
      { id: AvalancheSegment.Aregion, name: "A-regioner" },
      { id: AvalancheSegment.Bregion, name: "B-regioner" }
    ];
    this.selectedSegmentId = "" + AvalancheSegment.ABregion;

    this.lists = [];
    this.lists[AvalancheSegment.ABregion] = [];
    this.lists[AvalancheSegment.Bregion] = [];
    this.lists[AvalancheSegment.Aregion] = [];

    for(let i = 1; i < 30; i++) {

      let item = {
        id: Number(i),
        name: this.itemsType + " " + i,
        type: this.itemsType,
        forecast: {
          warnings: [{level: Math.floor(Math.random() * 4)}, {level: Math.floor(Math.random() * 4)}, {level: Math.floor(Math.random() * 4)}]
        }
      };

      if( item.id < 15) {
        item.name += " (A)";
        this.lists[AvalancheSegment.Aregion].push(item);
      } else {
        item.name += " (B)";
        this.lists[AvalancheSegment.Bregion].push(item);
      }

      this.lists[AvalancheSegment.ABregion].push(item);
    }
  }

  itemTapped(event, item) {
    this.navCtrl.push(RegionDetailsPage, {
      region: item
    });
  }

  segmentChanged(event) {
    console.log("Segment change");
    this.content.scrollToTop();
  }
}
