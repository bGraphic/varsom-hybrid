import { Component, ViewChild } from '@angular/core';
import { App, Platform, MenuController, Nav, Config } from 'ionic-angular';
import { StatusBar, InAppBrowser } from 'ionic-native';
import { TranslateService } from 'ng2-translate';
import * as moment from 'moment';
import 'moment/min/locales';

import { PushService } from "../providers/push";
import { SettingService } from "../providers/settings";
import { FloodLandslideListPage } from "../pages/list/flood-landslide-list";
import { AvalancheListPage } from "../pages/list/avalanche-list";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  sections: {titleKey: string, icon: string, active:boolean, component: any }[];
  external_links: { url: string, label: string, description: string};
  contact_links: { url: string, label: string, description: string};

  constructor(
    public platform: Platform,
    private _appCtrl: App,
    private _menu: MenuController,
    private _config: Config,
    private _translateService: TranslateService,
    private _pushService: PushService,
    private _settingService: SettingService
  ) {

    this.sections = [
      { titleKey: 'FLOOD_LANDSLIDE', icon: 'rainy', active:false, component: FloodLandslideListPage },
      { titleKey: 'AVALANCHE', icon: 'snow', active:false, component: AvalancheListPage }
    ];

    this.platform.ready().then(() => {
      this.initializeApp();
      this.initializeTranslation();
    });
  }

  private initializeApp() {

    this._settingService.activeSection$
      .subscribe(section => {
        if(section) {
          this._activateSection(section);
        }
      });

    StatusBar.styleDefault();

    this._pushService.register();

  }

  private initializeTranslation() {
    this._translateService.setDefaultLang('no_nb');
    this._translateService.use('no_nb');
    moment.locale('nb');

    this._translateService.get('EXTERNAL_MENU.LINKS').subscribe((res: any) => {
      this.external_links = res;
    });

    this._translateService.get('CONTACT_INFO.LINKS').subscribe((res: any) => {
      this.contact_links = res;
    });

    this._translateService.get('BACK').subscribe((res: string) => {
      this._config.set('ios', 'backButtonText', res);
    });
  }

  private _activateSection(sectionKey: string) {
    console.log("MyApp: Activate section", sectionKey);

    for(let section of this.sections) {
      if( section.titleKey === sectionKey ) {
        section.active = true;
        console.log("MyApp: Setting root");
        this._setRootPage(section);
      } else {
        section.active = false;
      }
    }
  }

  private _setRootPage(section) {
    let rootNav = this._appCtrl.getRootNav();
    let rootPage = rootNav.first();

    if(!rootPage || rootPage.component !== section.component) {
      this._appCtrl.getRootNav().setRoot(section.component);
    } else {
      console.log("MyApp: Root already at: ", section.titleKey);
    }
  }

  openSection(section: {titleKey: string, icon: string, active:boolean, component: any }) {

    console.log("MyApp: Open section", section.titleKey);
    this._settingService.activeSection = section.titleKey;
    this._menu.close();
  }

  launch(url: string) {
    new InAppBrowser(url, '_system');
  }
}
