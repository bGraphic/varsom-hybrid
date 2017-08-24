import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AreaDetailsPage } from '../area-details/area-details';
import { AreaUtils } from "../../utils/area-utils";
import { Forecast } from "../../models/Forecast";
import { ForecastService } from "../../providers/forecasts";
import { FavoriteService } from "../../providers/favorites";
import { GeoJsonService } from '../../providers/geojson';
import { SettingService } from "../../providers/settings";

import { Observable } from 'rxjs/rx';
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import * as fromRoot from './../../store/reducers';
import { Position } from './../../store/models/Location';

@Component({
  templateUrl: 'list.html'
})

export class FloodLandslideListPage {

  pageTitleKey: string;
  emptyListTitleKey: string;
  dummyForecasts = new Array(19);
  parentId: string = null;
  forecasts: Forecast[] = [];

  favorites: string[] = [];
  sections: string[] = [];

  segments = ['highest', 'flood', 'landslide'];
  selectedSegment: string;

  showMap: boolean = false;
  mapGeoJsonData: any;
  mapCenter: Observable<Position>;
  mapMarker: Observable<Position>;
  mapZoomLevel: Observable<number>;

  private _floodForecast: Forecast[] = [];
  private _landslideForecast: Forecast[] = [];
  private _subscriptions: Subscription[] = [];

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _forecastService: ForecastService,
    private _favoriteService: FavoriteService,
    private _geoJsonService: GeoJsonService,
    private _settingService: SettingService,
    private _store: Store<fromRoot.State>,

  ) {
    let area = _navParams.get('area');

    if (area) {
      this.pageTitleKey = area.name;
      this.emptyListTitleKey = 'MUNICIPALITIES_LIST_TITLE';
      this.parentId = area.id;
      this.sections = ['MUNICIPALITIES'];
    } else {
      this.pageTitleKey = 'FLOOD_LANDSLIDE';
      this.emptyListTitleKey = 'COUNTIES_LIST_TITLE';
      this.showMap = true;
      this.sections = ['COUNTIES'];
    }

    this.mapCenter = this._store.select(fromRoot.getPosition);
    // Position only has timestamp when actual position and not default
    this.mapMarker = this._store.select(fromRoot.getPosition).filter(pos => !!pos.timestamp);
    this.mapZoomLevel = this._store.select(fromRoot.getLocationZoomLevel);
  }

  ionViewDidEnter() {

    this._settingService.activeSection = 'FLOOD_LANDSLIDE';
  }

  ngOnInit() {

    if (this.showMap) {
      let geojsonSubscription = this._geoJsonService.counties$.subscribe(geojsonData => {
        this.mapGeoJsonData = geojsonData;
      });
      this._subscriptions.push(geojsonSubscription);
    }

    let forecastTypeSubscription = this._settingService.activeFloodLandslideSegment$
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

    if (this.parentId) {
      let areaSubscription = this._forecastService.getForecastForArea('flood', this.parentId)
        .subscribe(forecast => {
          this.pageTitleKey = forecast.areaName;
        });
      this._subscriptions.push(areaSubscription);
    }
  }

  ngOnDestroy() {
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  private _updateForecast() {
    let forecasts = [];

    if ('flood' === this.selectedSegment) {
      forecasts = this._floodForecast;
    } else if ('landslide' === this.selectedSegment) {
      forecasts = this._landslideForecast;
    } else {
      forecasts = Forecast.createHighestForecasts(this._floodForecast, this._landslideForecast);
    }

    if (this.parentId) {
      this.forecasts = Forecast.sortByAreaName(forecasts);
    } else {
      this.forecasts = Forecast.sortByAreaId(forecasts, true);
    }
  }

  private pushListPage(area: { id: string, name: string }) {
    if (AreaUtils.isOslo(area.id)) {
      this.pushDetailsPage(area);
    } else {
      this._navCtrl.push(FloodLandslideListPage, {
        area: area
      });
    }
  }

  private pushDetailsPage(area: { id: string, name: string }) {
    if (AreaUtils.isOslo(area.id)) {
      area.id = AreaUtils.OSLO_MUNICIPALITY_ID;
    }
    this._navCtrl.push(AreaDetailsPage, {
      area: area
    });
  }

  private pushPage(forecast: Forecast) {
    let area = {
      id: forecast.areaId,
      name: forecast.areaName
    };
    if (AreaUtils.isMunicipality(area.id)) {
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
    if (forecast) {
      this.pushPage(forecast);
    } else {
      console.log('FloodLandslideListPage: No matching area', areaId);
    }
  }

  onSegmentChanged() {
    this._settingService.activeFloodLandslideSegment = this.selectedSegment;
  }
}
