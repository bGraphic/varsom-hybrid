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

export class AvalancheListPage {

  pageTitleKey: string;
  forecasts: Forecast[] = [];

  sections = ['AVALANCHE', 'B_REGIONS'];
  segments = [];

  showMap: boolean = true;
  mapGeoJsonData: any;
  mapCenter: { latLng: L.LatLng, zoom: number };

  private _subscriptions: Subscription[] = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService, public settings: SettingsService, public geojson: GeojsonService) {
    this.pageTitleKey = "AVALANCHE";
  }

  ngOnInit() {

    if(this.showMap) {
      let geojsonSubscription = this.geojson.getRegions()
        .subscribe(geoJsonData => {
          this.mapGeoJsonData = geoJsonData;
        });
      this._subscriptions.push(geojsonSubscription);
    }

    let avalancheSubscription =  this.dataService.getForecasts('avalanche')
      .subscribe(forecasts => {
        this.forecasts = forecasts;
      });
    this._subscriptions.push(avalancheSubscription);

    let currentPositionSubscription = this.settings.currentPositionObs
      .subscribe(position => {
        this.mapCenter = position;
      });
    this._subscriptions.push(currentPositionSubscription);
  }

  ngOnDestroy() {
    for(let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  private pushDetailsPage(area: {id: string, name: string}) {
    this.navCtrl.push(AreaDetailsPage, {
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
