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
export class AvalancheListPage {

  pageTitle: string;
  areas: FirebaseListObservable<Area[]>;

  private getPageTitle(): string {
    return "Snøskred";
  }

  private getAreas(): FirebaseListObservable<Area[]> {
    return this.dataService.getRegions();
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, af: AngularFire, private dataService: DataService, public settings: SettingsService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.pageTitle = this.getPageTitle();
    this.areas = this.getAreas();
  }

  private pushRegionDetailsPage(navCtrl: NavController, municipality: Area) {
    navCtrl.push(MuncipalityDetailsPage, {
      municipality: municipality
    });
  }

  areaTapped(event, area) {
    this.pushRegionDetailsPage(this.navCtrl, area);
  }

  getForecast(area: Area): FirebaseObjectObservable<Forecast> {
    return area.getForecast('avalanche');
  }
}
