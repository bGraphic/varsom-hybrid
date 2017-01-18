import { Component, ViewChild } from '@angular/core';
import { App, Platform, MenuController, Nav, Config } from 'ionic-angular';
import { StatusBar, InAppBrowser, Splashscreen } from 'ionic-native';
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

    this.initializeTranslation();
    this.initializeApp();

    this.sections = [
      { titleKey: 'FLOOD_LANDSLIDE', icon: 'rainy', active:false, component: FloodLandslideListPage },
      { titleKey: 'AVALANCHE', icon: 'snow', active:false, component: AvalancheListPage }
    ];

    this._translateService.get('EXTERNAL_MENU.LINKS').subscribe((res: any) => {
      this.external_links = res;
    });

    this._translateService.get('CONTACT_INFO.LINKS').subscribe((res: any) => {
      this.contact_links = res;
    });
  }

  private initializeApp() {
    this.platform.ready().then(() => {

      StatusBar.styleDefault();
      this._pushService.register();

      this._translateService.get('BACK').subscribe((res: string) => {
        this._config.set('ios', 'backButtonText', res);
      });

      this._settingService.activeSection$
        .subscribe(activeSection => {
          this._activateSection(activeSection);
          this._setInitalRootPage(activeSection);
        });
    });
  }

  private initializeTranslation() {
    this._translateService.setDefaultLang('no_nb');
    this._translateService.use('no_nb');
    moment.locale('nb');
  }

  private _activateSection(sectionKey: string) {
    for(let section of this.sections) {
      if(section.titleKey === sectionKey.toUpperCase()) {
        section.active = true;
      } else {
        section.active = false;
      }
    }
  }

  private _setInitalRootPage(sectionKey: string) {
    if(this._appCtrl.getRootNav().first()) {
      return;
    }

    let component = FloodLandslideListPage;
    for(let section of this.sections) {
      if(section.titleKey === sectionKey.toUpperCase()) {
        component = section.component;
      }
    }

    console.log("MyApp: Setting inital root", sectionKey, component.name);
    this._appCtrl.getRootNav().setRoot(component);
    Splashscreen.hide();
  }

  openSection(section: {titleKey: string, icon: string, active:boolean, component: any }) {

    console.log("Open section:", section);
    this._appCtrl.getRootNav().setRoot(section.component);
    this._menu.close();
  }

  launch(url: string) {
    new InAppBrowser(url, '_system');
  }
}
