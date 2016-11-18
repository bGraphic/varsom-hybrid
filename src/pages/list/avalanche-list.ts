import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MuncipalityDetailsPage } from '../item-details/municipality-details';
import { Area } from "../../models/Area";
import { Observable } from 'rxjs/Observable';
import { Forecast } from "../../models/Forecast";
import { DataService } from "../../services/data";
import { GeojsonService }       from '../../services/geojson';
import {BehaviorSubject} from "rxjs";

@Component({
  templateUrl: 'list.html',
  providers: [ GeojsonService ]
})
export class AvalancheListPage {

  pageTitle: string;
  sections: {titleKey: string, areasObs: Observable<Area[]> }[];
  forecastTypeObs = new BehaviorSubject('avalanche');
  geojsonObs: Observable<GeoJSON.GeoJsonObject>;

  private getPageTitle(): string {
    return "Snøskred";
  }

  private getAreas(): Observable<Area[]> {
    return this.dataService.getRegions();
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService, public geojson: GeojsonService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.pageTitle = this.getPageTitle();

    if(this.isShowMap()) {
      this.geojsonObs = this.geojson.getRegions();
    }

    this.sections = [];
    this.sections.push({
      titleKey: 'avalanche',
      areasObs: this.getAreas()
    });

    this.sections.push({
      titleKey: 'b-regions',
      areasObs: this.getAreas()
    });
  }

  private pushRegionDetailsPage(navCtrl: NavController, municipality: Area) {
    navCtrl.push(MuncipalityDetailsPage, {
      municipality: municipality
    });
  }

  areaTapped(event, area) {
    this.pushRegionDetailsPage(this.navCtrl, area);
  }

  // getForecast(area: Area): Observable<Forecast> {
  //   return area.getForecast('avalanche');
  // }

  getForecastType(): string {
    return 'avalanche';
  }

  isShowMap(): boolean {
    return true;
  }
}
