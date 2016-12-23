import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AreaDetailsPage } from '../area-details/area-details';
import { Forecast } from "../../models/Forecast";
import { DataService } from "../../services/data";
import { GeojsonService }       from '../../services/geojson';
import { SettingsService } from "../../services/settings";
import { Subscription } from "rxjs";

@Component({
  templateUrl: 'list.html',
  providers: [ GeojsonService ]
})

export class FloodLandslideListPage {

  pageTitleKey: string;
  forecasts: Forecast[] = [];

  sections = [];
  segments = ['highest', 'flood', 'landslide'];
  selectedSegment: string;

  showMap: boolean = false;
  mapGeoJsonData: any;
  mapCenter: { latLng: L.LatLng, zoom: number };

  private _floodForecast:Forecast[] = [];
  private _landslideForecast:Forecast[] = [];
  private _parentId:string;
  private _subscriptions: Subscription[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService, public settings: SettingsService, private geojson: GeojsonService) {
    let area = navParams.get('area');

    if(area) {
      this.pageTitleKey = area.name;
      this._parentId = area.id;
    } else {
      this.pageTitleKey = 'FLOOD_LANDSLIDE';
      this.showMap = true;
    }
  }

  ngOnInit() {

    if(this.showMap) {
      let geojsonSubscription = this.geojson.getCounties().subscribe(geojsonData => {
        this.mapGeoJsonData = geojsonData;
      });
      this._subscriptions.push(geojsonSubscription);
    }

    let currentPositionSubscription = this.settings.currentPositionObs
      .subscribe(position => {
        this.mapCenter = position;
      });
    this._subscriptions.push(currentPositionSubscription);

    let forecastTypeSubscription = this.settings.currentForecastTypeObs
      .subscribe(forecastType => {
        this.selectedSegment = forecastType;
        this.sections = [ forecastType.toUpperCase() ];
        this._update();
      });
    this._subscriptions.push(forecastTypeSubscription);

    let floodForecastSubscription = this.dataService.getForecasts('flood', this._parentId)
      .subscribe(forecasts => {
        this._floodForecast = forecasts;
        this._update();
      });
    this._subscriptions.push(floodForecastSubscription);

    let landslideSubscription = this.dataService.getForecasts('landslide', this._parentId)
      .subscribe(forecasts => {
        this._landslideForecast = forecasts;
        this._update();
      });
    this._subscriptions.push(landslideSubscription);
  }

  ngOnDestroy() {
    for(let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  private _update() {
    if('flood' === this.selectedSegment) {
      this.forecasts = this._floodForecast;
    } else if('landslide' === this.selectedSegment) {
      this.forecasts = this._landslideForecast;
    } else {
      this.forecasts = Forecast.createHighestForecasts(this._floodForecast, this._landslideForecast);
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
    if(DataService.isOslo(area.id)) {
      area.id = DataService.OSLO_MUNICIPALITY_ID;
    }
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
    let forecast = Forecast.findForecastWithAreaId(this.forecasts, areaId);
    if(forecast) {
      this.pushPage(forecast);
    } else {
      console.log('FloodLandslideListPage: No matching area', areaId);
    }
  }

  onSegmentChanged() {
    this.settings.currentForecastType = this.selectedSegment;
  }
}
