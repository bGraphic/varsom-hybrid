import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';


@Component({
  templateUrl: 'region-details.html'
})
export class ItemDetailsPage {
  selectedRegion: any;
  pageTitle: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedRegion = navParams.get('region');
    this.pageTitle = this.selectedRegion.name;
  }
}
