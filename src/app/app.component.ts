import { Component, ViewChild } from '@angular/core';
import { Push, PushToken } from '@ionic/cloud-angular';
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

  constructor( public platform: Platform, public menu: MenuController, private translate: TranslateService, private config: Config, private push: Push ) {
    this.initializeApp();
    this.initializeTranslation();
    this.initializeSections();
  }

  ngAfterViewInit() {
    this.initializePush();
  }

  private initializeApp() {
    this.platform.ready().then(() => {

      StatusBar.styleDefault();
      this.translate.get('BACK').subscribe((res: string) => {
        this.config.set('ios', 'backButtonText', res);
      });

    });
  }

  private initializePush() {
    this.platform.ready().then(() => {

      if(!this.platform.is('cordova')) {
        return;
      }

      this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        console.log('MyApp: Token saved:', t.token);
      });

      this.push.rx.notification()
        .subscribe((msg) => {
          alert(msg.title + ': ' + msg.text);
        });

    });
  }

  private initializeTranslation() {
    this.translate.setDefaultLang('no_nb');
    this.translate.use('no_nb');
    moment.locale('nb');
  }

  private initializeSections() {
    // set our app's pages
    this.sections = [
      { titleKey: 'FLOOD_LANDSLIDE', icon: 'rainy', component: FloodLandslideListPage },
      { titleKey: 'AVALANCHE', icon: 'snow', component: AvalancheListPage },
      { titleKey: 'ICE', icon: 'disc', url: Constants.ICE_URL }
    ];

    this.openSection(this.sections[0]);
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
