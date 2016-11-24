import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ItemDetailsPage } from '../item-details/item-details';
import { Observable } from 'rxjs/Observable';
import { Forecast } from "../../models/Forecast";
import { DataService } from "../../services/data";
import { GeojsonService }       from '../../services/geojson';

@Component({
  templateUrl: 'list.html',
  providers: [ GeojsonService ]
})
export class AvalancheListPage {

  pageTitle: string;
  segments = [];
  sections: {titleKey: string, forecastsObs: Observable<Forecast[]> }[];
  geojsonObs: Observable<GeoJSON.GeoJsonObject>;


  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService, public geojson: GeojsonService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.pageTitle = "Snøskred";

    if(this.hasMap()) {
      this.geojsonObs = this.geojson.getRegions();
    }

    this.sections = [];
    this.sections.push({
      titleKey: 'avalanche',
      forecastsObs: this.dataService.getForecasts('avalanche')
    });

    this.sections.push({
      titleKey: 'b-regions',
      forecastsObs: this.dataService.getForecasts('avalanche')
    });
  }

  private pushRegionDetailsPage(navCtrl: NavController, forecast: Forecast) {
    navCtrl.push(ItemDetailsPage, {
      forecast: forecast
    });
  }

  forecastTapped(event, area) {
    this.pushRegionDetailsPage(this.navCtrl, area);
  }

  hasMap(): boolean {
    return true;
  }
}
