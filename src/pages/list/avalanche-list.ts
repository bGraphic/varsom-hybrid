import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AreaDetailsPage } from '../area-details/area-details';
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

export class AvalancheListPage {

  pageTitleKey: string;
  listHeaderKey: string;
  forecasts: Forecast[] = [];

  favorites: string[] = [];
  sections = ['A_REGIONS', 'B_REGIONS'];
  segments = [];

  showMap: boolean = true;
  mapGeoJsonData: any;
  mapCenter: { latLng: L.LatLng, zoom: number };

  private _subscriptions: Subscription[] = [];


  constructor(
    private _navCtrl: NavController,
    private _forecastService: ForecastService,
    private _favoriteService: FavoriteService,
    private _settingService: SettingService,
    private _geoJsonService: GeoJsonService
  ) {
    this.pageTitleKey = "AVALANCHE";
    this.listHeaderKey = "AVALANCHE";
  }

  ngOnInit() {

    if(this.showMap) {
      let geojsonSubscription = this._geoJsonService.regions$
        .subscribe(geoJsonData => {
          this.mapGeoJsonData = geoJsonData;
        });
      this._subscriptions.push(geojsonSubscription);
    }

    let avalancheSubscription =  this._forecastService.getForecasts('avalanche')
      .subscribe(forecasts => {
        this.forecasts = forecasts;
      });
    this._subscriptions.push(avalancheSubscription);

    let currentPositionSubscription = this._settingService.currentPositionObs
      .subscribe(position => {
        this.mapCenter = position;
      });
    this._subscriptions.push(currentPositionSubscription);

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

  private pushDetailsPage(area: {id: string, name: string}) {
    this._navCtrl.push(AreaDetailsPage, {
      area: area
    });
  }

  private pushPage(forecast:Forecast) {
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

    if(forecast) {
      this.pushPage(forecast);
    } else {
      console.log('AvalancheListPage: No matching area', areaId);
    }
  }
}
