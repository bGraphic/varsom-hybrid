import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AreaDetailsPage } from '../area-details/area-details';
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

export class AvalancheListPage {

  pageTitleKey: string;
  emptyListTitleKey: string;
  dummyForecasts = new Array(21);
  forecasts: Forecast[] = [];

  favorites: string[] = [];
  sections = ['B_REGIONS_ACTIVE', 'A_REGIONS', 'B_REGIONS'];

  segments = [];

  showMap: boolean = true;
  mapGeoJsonData: any;
  mapCenter: Observable<Position>;
  mapMarker: Observable<Position>;
  mapZoomLevel: Observable<number>;

  private _subscriptions: Subscription[] = [];

  constructor(
    private _navCtrl: NavController,
    private _forecastService: ForecastService,
    private _favoriteService: FavoriteService,
    private _geoJsonService: GeoJsonService,
    private _settingService: SettingService,
    private _store: Store<fromRoot.State>,
  ) {
    this.pageTitleKey = "AVALANCHE";
    this.emptyListTitleKey = "A_REGIONS_LIST_TITLE";

    this.mapCenter = this._store.select(fromRoot.getPosition);
    // Position only has timestamp when actual position and not default
    this.mapMarker = this._store.select(fromRoot.getPosition).filter(pos => !!pos.timestamp);
    this.mapZoomLevel = this._store.select(fromRoot.getLocationZoomLevel);
  }

  ionViewDidEnter() {
    this._settingService.activeSection = 'AVALANCHE';
  }

  ngOnInit() {

    if (this.showMap) {
      let geojsonSubscription = this._geoJsonService.regions$
        .subscribe(geoJsonData => {
          this.mapGeoJsonData = geoJsonData;
        });
      this._subscriptions.push(geojsonSubscription);
    }

    let avalancheSubscription = this._forecastService.getForecasts('avalanche')
      .subscribe(forecasts => {
        this.forecasts = Forecast.sortByAreaId(forecasts);
      });
    this._subscriptions.push(avalancheSubscription);

    let favoriteSubscription = this._favoriteService.favoriteAreaIds$
      .subscribe(favorites => {
        this.favorites = favorites;
      });
    this._subscriptions.push(favoriteSubscription);
  }

  ngOnDestroy() {
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  private pushDetailsPage(area: { id: string, name: string }) {
    this._navCtrl.push(AreaDetailsPage, {
      area: area
    });
  }

  private pushPage(forecast: Forecast) {
    this.pushDetailsPage({
      id: forecast.areaId,
      name: forecast.areaName
    });
  }

  onListForecastSelected(event, forecast: Forecast) {
    this.pushPage(forecast);
  }

  onMapAreaSelected(areaId: string) {
    let forecast = Forecast.findForecastWithAreaId(this.forecasts, areaId);

    if (forecast) {
      this.pushPage(forecast);
    } else {
      console.log('AvalancheListPage: No matching area', areaId);
    }
  }
}
