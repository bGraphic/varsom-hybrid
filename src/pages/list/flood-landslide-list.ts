import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MuncipalityDetailsPage } from '../item-details/municipality-details';
import { Area } from "../../models/Area";
import { Forecast } from "../../models/Forecast";
import { DataService } from "../../services/data";
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
  templateUrl: 'list.html'
})
export class FloodLandslideListPage {

  forecastType: string;
  areaType: string;

  pageTitle: string;
  parent: Area;
  forecastSegments: { slug: string, name: string }[];
  areas: FirebaseListObservable<Area[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, af: AngularFire, private dataService: DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.parent = navParams.get('parent');
    this.forecastType = navParams.get('forecastType');

    this.forecastSegments = [
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
      this.areaType = 'county';
    } else {
      this.areas = this.dataService.getMunicipalities(this.parent.getKey());
      this.areaType = 'municipality';
    }

    if(!this.forecastType) {
      this.forecastType = 'highest';
    }
  }

  itemTapped(event, item) {
    if(!this.parent) {
      this.navCtrl.push(FloodLandslideListPage, {
        parent: item,
        forecastType: this.forecastType
      });
    } else {
      this.navCtrl.push(MuncipalityDetailsPage, {
        municipality: item
      });
    }
  }

  getForecast(area: Area, forecastType: string): FirebaseObjectObservable<Forecast> {
    return this.dataService.getForecast(area, forecastType);
  }
}
