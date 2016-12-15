import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ItemDetailsPage } from '../item-details/item-details';
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

  pageTitleKey: string;
  segments = [];
  sections: {titleKey: string, forecastsObs: BehaviorSubject<Forecast[]> }[];
  geojsonObs: Observable<GeoJSON.GeoJsonObject>;


  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService, public geojson: GeojsonService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.pageTitleKey = "AVALANCHE";

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

  private pushRegionDetailsPage(forecast: Forecast) {
    this.navCtrl.push(ItemDetailsPage, {
      forecast: forecast
    });
  }

  onListForecastSelected(event, forecast: Forecast) {
    this.pushRegionDetailsPage(forecast);
  }

  onMapAreaSelected(areaId: string) {
    let forecastsA =  this.sections[0].forecastsObs.getValue();
    let forecastsB =  this.sections[0].forecastsObs.getValue();
    let filteredForecastsA = forecastsA.filter(forecast => forecast.areaId == areaId);
    let filteredForecastsB = forecastsB.filter(forecast => forecast.areaId == areaId);

    if(filteredForecastsA.length > 0 ) {
      this.pushRegionDetailsPage(filteredForecastsA[0]);
    } else if(filteredForecastsB.length > 0 ) {
      this.pushRegionDetailsPage(filteredForecastsB[0]);
    } else {
      console.log('AvalancheListPage: No matching area', areaId);
    }
  }

  hasMap(): boolean {
    return true;
  }
}
