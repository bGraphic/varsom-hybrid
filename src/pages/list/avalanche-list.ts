import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ItemDetailsPage } from '../item-details/item-details';
import { Forecast } from "../../models/Forecast";
import { DataService } from "../../services/data";
import { GeojsonService }       from '../../services/geojson';
import { SettingsService } from "../../services/settings";

@Component({
  templateUrl: 'list.html',
  providers: [ GeojsonService ]
})
export class AvalancheListPage {

  pageTitleKey: string;
  segments = [];
  sections: {titleKey: string, forecasts: Forecast[] }[] = [];
  mapGeoJsonData: any;
  mapCenter: { latLng: L.LatLng, zoom: number };


  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService, public settings: SettingsService, public geojson: GeojsonService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.pageTitleKey = "AVALANCHE";

    if(this.hasMap()) {
      this.geojson.getRegions()
        .subscribe(geoJsonData => {
          this.mapGeoJsonData = geoJsonData;
        });
    }

    this.dataService.getForecasts('avalanche')
      .subscribe(forecasts => {
        this._updateSections(forecasts);
      });

    this.settings.currentPositionObs
      .subscribe(position => {
        this.mapCenter = position;
      });
  }

  private _updateSections(forecasts) {

    let sectionA = {
      titleKey: 'AVALANCHE',
      timeframe: Forecast.getTimeframeFromForecasts(forecasts),
      forecasts: forecasts
    }

    let sectionB = {
      titleKey: 'B_REGIONS',
      timeframe: Forecast.getTimeframeFromForecasts(forecasts),
      forecasts: forecasts
    }

    if(!this.sections[0]) {
      this.sections.push(sectionA);
    } else {
      this.sections[0] = sectionA;
    }

    this.sections.push({
      titleKey: 'B_REGIONS',
      forecasts: forecasts
    });

    if(!this.sections[1]) {
      this.sections.push(sectionB);
    } else {
      this.sections[1] = sectionB;
    }
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
    let forecastsA =  this.sections[0].forecasts;
    let forecastsB =  this.sections[0].forecasts;
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
