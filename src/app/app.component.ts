import { Component, ViewChild } from '@angular/core';
import { App, Platform, MenuController, Nav, Config } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
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
  links: { url: string, label: string, description: string};

  constructor(
    public platform: Platform,
    private _appCtrl: App,
    private _menu: MenuController,
    private _config: Config,
    private _translateService: TranslateService,
    private _pushService: PushService,
    private _settingService: SettingService
  ) {
    this.initializeApp();
    this.initializeTranslation();

    this.sections = [
      { titleKey: 'FLOOD_LANDSLIDE', icon: 'rainy', active:false, component: FloodLandslideListPage },
      { titleKey: 'AVALANCHE', icon: 'snow', active:false, component: AvalancheListPage }
    ];

    this._translateService.get('EXTERNAL_LINKS').subscribe((res: any) => {
      console.log("links", res);
      this.links = res;
    });

    this._settingService.sections = this.sections;
    this.rootPage = FloodLandslideListPage;
  }

  private initializeApp() {
    this.platform.ready().then(() => {

      StatusBar.styleDefault();
      this._pushService.register();

      this._translateService.get('BACK').subscribe((res: string) => {
        this._config.set('ios', 'backButtonText', res);
      });

    });
  }

  private initializeTranslation() {
    this._translateService.setDefaultLang('no_nb');
    this._translateService.use('no_nb');
    moment.locale('nb');
  }

  openSection(section) {

    console.log("Open section:", section);
    this._appCtrl.getRootNav().setRoot(section.component);

    this._menu.close();
  }
}
