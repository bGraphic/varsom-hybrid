import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MuncipalityDetailsPage } from '../item-details/municipality-details';
import { Area } from "../../models/Area";
import { Forecast } from "../../models/Forecast";
import { DataService } from "../../services/data";
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { SettingsService } from "../../services/settings";

@Component({
  templateUrl: 'list.html'
})
export class FloodLandslideListPage {

  forecastSegments = [
    { slug: 'highest', name: "Felles" },
    { slug: 'flood', name: "Flom" },
    { slug: 'landslide', name: "Jordskred" }
  ];

  pageTitle: string;
  selectedCounty: Area;
  areas: FirebaseListObservable<Area[]>;

  private getPageTitle(parent: Area): string {
    if(!this.selectedCounty) {
      return 'Flom / jordskred';
    } else {
      return this.selectedCounty.getName();
    }
  }

  private getAreas(parent: Area): FirebaseListObservable<Area[]> {
    if(!this.selectedCounty) {
      return this.dataService.getCounties();
    } else {
      return this.dataService.getMunicipalities(this.selectedCounty.getKey());
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, af: AngularFire, private dataService: DataService, public settings: SettingsService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedCounty = navParams.get('county');
    this.pageTitle = this.getPageTitle(this.selectedCounty);
    this.areas = this.getAreas(this.selectedCounty);
  }

  private pushCountyFloodLandslideListPage(navCtrl: NavController, county: Area) {
    navCtrl.push(FloodLandslideListPage, {
      county: county
    });
  }

  private pushMunicipalityDetailsPage(navCtrl: NavController, municipality: Area) {
    navCtrl.push(MuncipalityDetailsPage, {
      municipality: municipality
    });
  }

  areaTapped(event, area) {
    if(!this.selectedCounty) {
      this.pushCountyFloodLandslideListPage(this.navCtrl, area);
    } else {
      this.pushMunicipalityDetailsPage(this.navCtrl, area);
    }
  }

  getForecast(area: Area): FirebaseObjectObservable<Forecast> {
    return area.getForecast(this.settings.selectedForecastType);
  }
}
