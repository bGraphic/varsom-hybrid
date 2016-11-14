import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MuncipalityDetailsPage } from '../item-details/municipality-details';
import { Area } from "../../models/Area";
import { DataService } from "../../services/data";
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  templateUrl: 'list.html'
})
export class FloodLandslideListPage {

  forecastType: string = 'highest';

  pageTitle: string;
  parent: Area;
  segments: { slug: string, name: string }[];
  areas: FirebaseListObservable<Area[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, af: AngularFire, private dataService: DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.parent = navParams.get('parent');
    this.segments = [
      { slug: 'highest', name: "Felles" },
      { slug: 'flood', name: "Flom" },
      { slug: 'landslide', name: "Jordskred" }
    ];

    if(!this.parent) {
      this.pageTitle = 'Flom / jordskred';
    } else {
      this.pageTitle = this.parent.getName();
    }

    if(!this.parent) {
      this.areas = this.dataService.getCounties();
    } else {
      this.areas = this.dataService.getMunicipalities(this.parent.getKey());
    }
  }

  itemTapped(event, item) {
    if(!this.parent) {
      this.navCtrl.push(FloodLandslideListPage, {
        parent: item
      });
    } else {
      this.navCtrl.push(MuncipalityDetailsPage, {
        municipality: item
      });
    }
  }
}
