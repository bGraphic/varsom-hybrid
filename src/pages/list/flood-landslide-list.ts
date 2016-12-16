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

export class FloodLandslideListPage {

  segments = [
    { slug: 'highest', titleKey: "HIGHEST" },
    { slug: 'flood', titleKey: "FLOOD" },
    { slug: 'landslide', titleKey: "LANDSLIDE" }
  ];
  selectedSegment: string;

  pageTitleKey: string;
  selectedCountyId: string;
  sections: {titleKey: string, timeframe: Date[], forecasts: Forecast[] }[] = [];
  mapGeoJsonData: any;
  mapCenter: { latLng: L.LatLng, zoom: number };

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
      this.geojson.getCounties().subscribe(geojsonData => {
        this.mapGeoJsonData = geojsonData;
      });
    }

    this.settings.currentForecastTypeObs
      .subscribe(forecastType => {
        this.selectedSegment = forecastType;
        this.dataService.getForecasts(forecastType, this.selectedCountyId)
          .subscribe(forecasts => {
            this._updateSections(forecastType, forecasts);
          });
      });

    this.settings.currentPositionObs
      .subscribe(position => {
        this.mapCenter = position;
      });
  }

  private _updateSections(forecastType: string, forecasts: Forecast[]) {

    if(forecastType !== this.selectedSegment) {
      return;
    }

    let section = {
      titleKey: forecastType.toUpperCase(),
      timeframe: Forecast.getTimeframeFromForecasts(forecasts),
      forecasts: forecasts
    }

    if(!this.sections[0]) {
      this.sections.push(section);
    } else {
      this.sections[0] = section;
    }
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
      forecast: forecast
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
    let forecasts =  this.sections[0].forecasts;
    let filteredForecasts = forecasts.filter(forecast => forecast.areaId == areaId);
    if(filteredForecasts.length > 0 ) {
      this.pushCountyFloodLandslideListPage(filteredForecasts[0]);
    } else {
      console.log('FloodLandslideListPage: No matching area', areaId);
    }
  }

  selectedSegmentChanged() {
    this.settings.currentForecastType = this.selectedSegment;
  }

  hasMap(): boolean {
    if(!this.selectedCountyId) {
      return true;
    } else {
      return false;
    }
  }
}
