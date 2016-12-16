import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { TranslateService } from 'ng2-translate';

import { FloodLandslideListPage } from '../pages/list/flood-landslide-list';
import { AvalancheListPage } from "../pages/list/avalanche-list";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = FloodLandslideListPage;
  sections: Array<{titleKey: string, icon: string, component: any }>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    translate: TranslateService
  ) {
    this.initializeApp();
    translate.setDefaultLang('no_nb');
    translate.use('no_nb');

    // set our app's pages
    this.sections = [
      { titleKey: 'FLOOD_LANDSLIDE', icon: 'rainy', component: FloodLandslideListPage },
      { titleKey: 'AVALANCHE', icon: 'snow', component: AvalancheListPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openSection(section) {
    // close the menu when clicking a link from the menu
    this.menu.close();

    // navigate to the new page if it is not the current page
    this.nav.setRoot(section.component, { forecastType: section.forecastType });
  }
}
