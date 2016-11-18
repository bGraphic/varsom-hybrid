import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NavController, NavParams } from 'ionic-angular';
import { MuncipalityDetailsPage } from '../item-details/municipality-details';
import { Area } from "../../models/Area";
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
    { slug: 'highest', name: "Felles" },
    { slug: 'flood', name: "Flom" },
    { slug: 'landslide', name: "Jordskred" }
  ];
  selectedSegment: string;

  pageTitle: string;
  selectedCounty: Area;
  sections: {titleKey: string, areasObs: Observable<Area[]> }[];
  forecastTypeObs = this.settings.selectedForecastTypeObs;
  geojsonObs: Observable<GeoJSON.GeoJsonObject>;

  private getAreas(parent: Area): Observable<Area[]> {
    if(!parent) {
      return this.dataService.getCounties();
    } else {
      return this.dataService.getMunicipalitiesForCountyWithKey(this.selectedCounty.key);
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService, public settings: SettingsService, private geojson: GeojsonService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedCounty = navParams.get('county');

    if(this.isShowMap()) {
      this.geojsonObs = this.geojson.getCounties();
    }

    this.sections = [];
    this.sections.push({
      titleKey: this.settings.selectedForecastTypeObs.getValue(),
      areasObs: this.getAreas(this.selectedCounty)
    });

    this.forecastTypeObs
      .subscribe(forecastType => {
        this.sections[0].titleKey = forecastType;
      });

    if(!this.selectedCounty) {
      this.pageTitle = 'Flom / jordskred';
    } else {
      this.pageTitle = this.selectedCounty.name;
    }
  }

  ionViewWillEnter() {
    this.selectedSegment = this.settings.selectedForecastTypeObs.getValue();
  }

  private pushCountyFloodLandslideListPage(navCtrl: NavController, county: Area) {
    navCtrl.push(FloodLandslideListPage, {
      county: county
    });
  }

  private pushMunicipalityDetailsPage(navCtrl: NavController, municipality: Area) {
    navCtrl.push(MuncipalityDetailsPage, {
      municipality: municipality
    });
  }

  areaTapped(event, area) {
    if(!this.selectedCounty) {
      this.pushCountyFloodLandslideListPage(this.navCtrl, area);
    } else {
      this.pushMunicipalityDetailsPage(this.navCtrl, area);
    }
  }

  selectedSegmentChanged() {
    this.settings.selectedForecastTypeObs.next(this.selectedSegment);
  }

  isShowMap(): boolean {
    if(!this.selectedCounty) {
      return true;
    } else {
      return false;
    }
  }
}
