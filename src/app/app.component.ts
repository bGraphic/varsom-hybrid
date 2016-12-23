import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, Config } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { TranslateService } from 'ng2-translate';
import { InAppBrowser } from 'ionic-native';
import * as moment from 'moment';
import 'moment/min/locales';


import { FloodLandslideListPage } from '../pages/list/flood-landslide-list';
import { AvalancheListPage } from "../pages/list/avalanche-list";
import {Constants} from "../providers/constants";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any;
  sections: Array<{titleKey: string, icon: string, component?: any, url?: string, active?:boolean}>;

  constructor( public platform: Platform, public menu: MenuController, private translate: TranslateService, private config: Config ) {
    this.initializeApp();
    this.translate.setDefaultLang('no_nb');
    this.translate.use('no_nb');
    moment.locale('nb');

    // set our app's pages
    this.sections = [
      { titleKey: 'FLOOD_LANDSLIDE', icon: 'rainy', component: FloodLandslideListPage },
      { titleKey: 'AVALANCHE', icon: 'snow', component: AvalancheListPage },
      { titleKey: 'ICE', icon: 'disc', url: Constants.ICE_URL }
    ];

    this.openSection(this.sections[0]);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.translate.get('BACK').subscribe((res: string) => {
        this.config.set('ios', 'backButtonText', res);
      });
    });
  }

  openSection(section) {

    // navigate to the new page if it is not the current page
    if(section.component) {
      this._activateSection(section);
      this.rootPage = section.component;
    } else if(section.url) {
      new InAppBrowser(section.url, '_system');
    }

    // close the menu when clicking a link from the menu
    this.menu.close();
  }

  private _activateSection(section) {
    for(let section of this.sections ) {
      section.active = false;
    }
    section.active = true;
  }
}
