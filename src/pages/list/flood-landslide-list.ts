import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NavController, NavParams } from 'ionic-angular';
import { MuncipalityDetailsPage } from '../item-details/municipality-details';
import { Area } from "../../models/Area";
import { Forecast } from "../../models/Forecast";
import { DataService } from "../../services/data";
import { SettingsService } from "../../services/settings";

@Component({
  templateUrl: 'list.html'
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
  sections: {titleKey: string, areas: Observable<Area[]> }[];

  private getPageTitle(parent: Area): string {
    if(!parent) {
      return 'Flom / jordskred';
    } else {
      return this.selectedCounty.getName();
    }
  }

  private getAreas(parent: Area): Observable<Area[]> {
    if(!parent) {
      return this.dataService.getCounties();
    } else {
      return this.dataService.getMunicipalities(this.selectedCounty.getKey());
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService, public settings: SettingsService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedCounty = navParams.get('county');
    this.pageTitle = this.getPageTitle(this.selectedCounty);

    this.sections = [];
    this.sections.push({
      titleKey: this.settings.selectedForecastType,
      areas: this.getAreas(this.selectedCounty)
    });
  }

  ionViewWillEnter() {
    this.selectedSegment = this.settings.selectedForecastType;
    this.selectedSegmentChanged();
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

  getForecast(area: Area): Observable<Forecast> {
    return area.getForecast(this.getForecastType());
  }

  selectedSegmentChanged() {
    this.settings.selectedForecastType = this.selectedSegment;
    this.sections[0].titleKey = this.selectedSegment;
  }

  isShowMap(parent: Area): boolean {
    if(!this.selectedCounty) {
      return true;
    } else {
      return false;
    }
  }

  getForecastType(): string {
    return this.settings.selectedForecastType;
  }
}
