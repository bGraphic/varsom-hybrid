import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';


@Component({
  templateUrl: 'municipality-details.html'
})
export class MuncipalityDetailsPage {
  selectedMunicipality: any;
  pageTitle: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedMunicipality = navParams.get('municipality');
    this.pageTitle = this.selectedMunicipality.name;
  }
}
