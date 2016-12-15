import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NavController, NavParams } from 'ionic-angular';
import { ItemDetailsPage } from '../item-details/item-details';
import { Forecast } from "../../models/Forecast";
import { DataService } from "../../services/data";
import { GeojsonService }       from '../../services/geojson';
import { SettingsService } from "../../services/settings";
import {BehaviorSubject} from "rxjs";

@Component({
  templateUrl: 'list.html',
  providers: [ GeojsonService ]
})
export class FloodLandslideListPage {

  segments = [
    { slug: 'highest', titleKey: "HIGHEST" },
    { slug: 'flood', titleKey: "FLOOD" },
    { slug: 'landslide', titleKey: "LANDSLIDE" }
  ];
  selectedSegment: string;

  pageTitleKey: string;
  selectedCountyId: string;
  sections: {titleKey: string, forecastsObs: BehaviorSubject<Forecast[]> }[];
  forecastTypeObs = this.settings.selectedForecastTypeObs;
  geojsonObs: Observable<GeoJSON.GeoJsonObject>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService, public settings: SettingsService, private geojson: GeojsonService) {
    // If we navigated to this page, we will have an item available as a nav param
    let county = navParams.get('county');
    if(county) {
      this.pageTitleKey = county.name;
      this.selectedCountyId = county.id;
    } else {
      this.pageTitleKey = 'FLOOD_LANDSLIDE';
    }

    if(this.hasMap()) {
      this.geojsonObs = this.geojson.getCounties();
    }

    this.sections = [];
    this.sections.push({
      titleKey: this.forecastTypeObs.getValue(),
      forecastsObs: this.dataService.getForecasts(this.forecastTypeObs.getValue(), this.selectedCountyId)
    });

    this.forecastTypeObs
      .subscribe(forecastType => {
        this.sections[0].titleKey = forecastType.toUpperCase();
        this.sections[0].forecastsObs = this.dataService.getForecasts(this.forecastTypeObs.getValue(), this.selectedCountyId);
      });
  }

  ionViewWillEnter() {
    this.selectedSegment = this.forecastTypeObs.getValue();
  }

  private pushCountyFloodLandslideListPage(forecast: Forecast) {
    if( Forecast.isOslo(forecast)) {
      this.pushMunicipalityDetailsPage(forecast);
    } else {
      this.navCtrl.push(FloodLandslideListPage, {
        county: {
          id: forecast.areaId,
          name: forecast.areaName
        }
      });
    }
  }

  private pushMunicipalityDetailsPage(forecast: Forecast) {
    this.navCtrl.push(ItemDetailsPage, {
      municipality: {
        id: forecast.areaId,
        name: forecast.areaName
      }
    });
  }

  onListForecastSelected(event, forecast: Forecast) {
    if (this.selectedCountyId) {
      this.pushMunicipalityDetailsPage(forecast);
    } else {
      this.pushCountyFloodLandslideListPage(forecast);
    }
  }

  onMapAreaSelected(areaId: string) {
    let forecasts =  this.sections[0].forecastsObs.getValue();
    let filteredForecasts = forecasts.filter(forecast => forecast.areaId == areaId);
    if(filteredForecasts.length > 0 ) {
      this.pushCountyFloodLandslideListPage(filteredForecasts[0]);
    } else {
      console.log('FloodLandslideListPage: No matching area', areaId);
    }
  }

  selectedSegmentChanged() {
    this.settings.selectedForecastTypeObs.next(this.selectedSegment);
  }

  hasMap(): boolean {
    if(!this.selectedCountyId) {
      return true;
    } else {
      return false;
    }
  }
}
