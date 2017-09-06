import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
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
import * as UIMapActions from './../../store/actions/ui-map.actions';
import { Position } from './../../store/models/Location';

@Component({
  templateUrl: 'list.html'
})

export class AvalancheListPage {
  @ViewChild(Content) content: Content;

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
  mapMoved: Observable<boolean>;
  mapFullscreen: Observable<boolean>;

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

    this.mapMarker = this._store.select(fromRoot.getPosition);
    this.mapCenter = this._store.select(fromRoot.getMapCenter('AVALANCHE'));
    this.mapZoomLevel = this._store.select(fromRoot.getMapZoom('AVALANCHE'));
    this.mapMoved = this._store.select(fromRoot.getMapMoved('AVALANCHE'));
    this.mapFullscreen = this._store.select(fromRoot.getMapFullscreen('AVALANCHE'));

    this.mapFullscreen.subscribe((test) => {
      console.log('Fullscreen', test);
    })

    this.mapZoomLevel.subscribe((test) => {
      console.log('Zoom', test);
    })
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

  mapOffset(mapFullscreen) {
    if (mapFullscreen) {
      return 0;
    }

    const height = this.content.contentTop + this.content.contentHeight;
    return - (height * 0.15 + height * 0.35 / 2 - this.content.contentTop);
  }

  onMapFullscreenToggle() {
    this._store.dispatch(new UIMapActions.ToogleFullscreen({ mapKey: 'AVALANCHE' }));
  }

  onMapCenterOnMarker() {
    this._store.dispatch(new UIMapActions.CenterOnMarker({ mapKey: 'AVALANCHE' }));
  }

  onMapMoved(position: Position) {
    this._store.dispatch(new UIMapActions.MapMoved({ mapKey: 'AVALANCHE' }));
  }

  onMapZoomUpdated(zoom: number) {
    this._store.dispatch(new UIMapActions.ZoomUpdated({ mapKey: 'AVALANCHE', zoom }));
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
