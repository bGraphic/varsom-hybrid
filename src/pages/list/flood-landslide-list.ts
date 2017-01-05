import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AreaDetailsPage } from '../area-details/area-details';
import { AreaUtils } from "../../utils/area-utils";
import { Forecast } from "../../models/Forecast";
import { ForecastService } from "../../providers/forecasts";
import { FavoriteService } from "../../providers/favorites";
import { GeoJsonService }       from '../../providers/geojson';
import { SettingService } from "../../providers/settings";
import { Subscription } from "rxjs";

@Component({
  templateUrl: 'list.html',
  providers: [ GeoJsonService ]
})

export class FloodLandslideListPage {

  pageTitleKey: string;
  parentId:string = null;
  forecasts: Forecast[] = [];

  favorites:string[] = [];
  sections:string[] = [];

  segments = ['highest', 'flood', 'landslide'];
  selectedSegment: string;

  showMap: boolean = false;
  mapGeoJsonData: any;
  mapCenter: { latLng: L.LatLng, zoom: number };

  private _floodForecast:Forecast[] = [];
  private _landslideForecast:Forecast[] = [];
  private _subscriptions: Subscription[] = [];

  constructor(

    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _forecastService: ForecastService,
    private _favoriteService: FavoriteService,
    private _settingService: SettingService,
    private _geoJsonService: GeoJsonService

  ) {
    let area = _navParams.get('area');

    if(area) {
      this.pageTitleKey = area.name;
      this.parentId = area.id;
      this.sections = ['MUNICIPALITIES'];
    } else {
      this.pageTitleKey = 'FLOOD_LANDSLIDE';
      this.showMap = true;
      this.sections = ['COUNTIES'];
    }
  }

  ngOnInit() {

    if(this.showMap) {
      let geojsonSubscription = this._geoJsonService.counties$.subscribe(geojsonData => {
        this.mapGeoJsonData = geojsonData;
      });
      this._subscriptions.push(geojsonSubscription);
    }

    let currentPositionSubscription = this._settingService.currentPositionObs
      .subscribe(position => {
        this.mapCenter = position;
      });
    this._subscriptions.push(currentPositionSubscription);

    let forecastTypeSubscription = this._settingService.currentForecastTypeObs
      .subscribe(forecastType => {
        this.selectedSegment = forecastType;
        this._updateForecast();
      });
    this._subscriptions.push(forecastTypeSubscription);

    let floodForecastSubscription = this._forecastService.getForecasts('flood', this.parentId)
      .subscribe(forecasts => {
        this._floodForecast = forecasts;
        this._updateForecast();
      });
    this._subscriptions.push(floodForecastSubscription);

    let landslideSubscription = this._forecastService.getForecasts('landslide', this.parentId)
      .subscribe(forecasts => {
        this._landslideForecast = forecasts;
        this._updateForecast();
      });
    this._subscriptions.push(landslideSubscription);

    let favoriteSubscription = this._favoriteService.favoriteAreaIds$
      .subscribe(favorites => {
        this.favorites = favorites;
      });
    this._subscriptions.push(favoriteSubscription);
  }

  ngOnDestroy() {
    for(let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  private _updateForecast() {
    let forecasts = [];

    if('flood' === this.selectedSegment) {
      forecasts = this._floodForecast;
    } else if('landslide' === this.selectedSegment) {
      forecasts = this._landslideForecast;
    } else {
      forecasts = Forecast.createHighestForecasts(this._floodForecast, this._landslideForecast);
    }

    if(this.parentId) {
      this.forecasts = Forecast.sortByAreaName(forecasts);
    } else {
      this.forecasts = Forecast.sortByAreaId(forecasts, true);
    }
  }

  private pushListPage(area: {id:string, name:string}) {
    if( AreaUtils.isOslo(area.id)) {
      this.pushDetailsPage(area);
    } else {
      this._navCtrl.push(FloodLandslideListPage, {
        area: area
      });
    }
  }

  private pushDetailsPage(area: {id:string, name:string}) {
    if(AreaUtils.isOslo(area.id)) {
      area.id = AreaUtils.OSLO_MUNICIPALITY_ID;
    }
    this._navCtrl.push(AreaDetailsPage, {
      area: area
    });
  }

  private pushPage(forecast:Forecast) {
    let area = {
      id: forecast.areaId,
      name: forecast.areaName
    };
    if(AreaUtils.isMunicipality(area.id)) {
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
    this._settingService.currentForecastType = this.selectedSegment;
  }
}
