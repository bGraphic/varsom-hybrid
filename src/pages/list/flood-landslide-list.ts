import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AreaDetailsPage } from '../area-details/area-details';
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
  sections: {titleKey: string, timeframe: Date[], forecasts: Forecast[] }[] = [];
  showMap: boolean = false;
  mapGeoJsonData: any;
  mapCenter: { latLng: L.LatLng, zoom: number };

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService, public settings: SettingsService, private geojson: GeojsonService) {
    // If we navigated to this page, we will have an item available as a nav param
    let area = navParams.get('area');
    let parentId;
    if(area) {
      this.pageTitleKey = area.name;
      parentId = area.id;
    } else {
      this.pageTitleKey = 'FLOOD_LANDSLIDE';
      this.showMap = true;
      this.geojson.getCounties().subscribe(geojsonData => {
        this.mapGeoJsonData = geojsonData;
      });
    }

    this.settings.currentForecastTypeObs
      .subscribe(forecastType => {
        this.selectedSegment = forecastType;
        this.dataService.getForecasts(forecastType, parentId)
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

  private pushListPage(area: {id:string, name:string}) {
    if( DataService.isOslo(area.id)) {
      this.pushDetailsPage(area);
    } else {
      this.navCtrl.push(FloodLandslideListPage, {
        area: area
      });
    }
  }

  private pushDetailsPage(area: {id:string, name:string}) {
    this.navCtrl.push(AreaDetailsPage, {
      area: area
    });
  }

  private pushPage(forecast:Forecast) {
    let area = {
      id: forecast.areaId,
      name: forecast.areaName
    };
    if(DataService.isMunicipality(area.id)) {
      this.pushDetailsPage(area);
    } else {
      this.pushListPage(area);
    }
  }

  onListForecastSelected(event, forecast: Forecast) {
    this.pushPage(forecast);
  }

  onMapAreaSelected(areaId: string) {
    let forecasts =  this.sections[0].forecasts;
    let forecast = Forecast.findForecastWithAreaId(forecasts, areaId)
    if(forecast) {
      this.pushPage(forecast);
    } else {
      console.log('FloodLandslideListPage: No matching area', areaId);
    }
  }

  selectedSegmentChanged() {
    this.settings.currentForecastType = this.selectedSegment;
  }
}
