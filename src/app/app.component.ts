import { Component, ViewChild } from "@angular/core";
import { App, Platform, MenuController, Nav, Config } from "ionic-angular";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";
import "moment/min/locales";

import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as fromRoot from "./../store/reducers";

import { PushService } from "../providers/push";
import { SettingService } from "../providers/settings";
import { AppVersionService } from "../providers/app-version";
import { FloodLandslideListPage } from "../pages/list/flood-landslide-list";
import { AvalancheListPage } from "../pages/list/avalanche-list";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  sections: {
    titleKey: string;
    icon: string;
    active: boolean;
    component: any;
  }[];
  external_links: { url: string; label: string; description: string };
  contact_links: { url: string; label: string; description: string };
  logos: {
    header: string;
    list: string[];
  }[];

  constructor(
    public platform: Platform,
    private _appCtrl: App,
    private _menu: MenuController,
    private _config: Config,
    private _translateService: TranslateService,
    private _pushService: PushService,
    private _settingService: SettingService,
    private _appVersionService: AppVersionService,
    private _splashScreen: SplashScreen,
    private _statusBar: StatusBar,
    private _iab: InAppBrowser,
    private _store: Store<fromRoot.State>
  ) {
    this.initializeTranslation();
    this.initializeApp();
    this._appVersionService.checkAppVersion();

    this.sections = [
      {
        titleKey: "FLOOD_LANDSLIDE",
        icon: "rainy",
        active: false,
        component: FloodLandslideListPage
      },
      {
        titleKey: "AVALANCHE",
        icon: "snow",
        active: false,
        component: AvalancheListPage
      }
    ];

    this._translateService.get("EXTERNAL_MENU.LINKS").subscribe((res: any) => {
      this.external_links = res;
    });

    this._translateService.get("CONTACT_INFO.LINKS").subscribe((res: any) => {
      this.contact_links = res;
    });

    this._translateService
      .get("LOGOS")
      .subscribe(
        (res: { [key: string]: { HEADER: string; LIST: string[] } }) => {
          console.log(res);
          this.logos = Object.keys(res).reduce((logos, key) => {
            logos.push({
              header: res[key].HEADER,
              list: res[key].LIST
            });
            return logos;
          }, []);
          console.log(this.logos);
        }
      );
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this._statusBar.styleDefault();
      this._pushService.register();

      this._translateService.get("BACK").subscribe((res: string) => {
        this._config.set("ios", "backButtonText", res);
      });

      this._settingService.activeSection$.subscribe(activeSection => {
        this._activateSection(activeSection);
        this._setInitalRootPage(activeSection);
      });
    });
  }

  private initializeTranslation() {
    this._translateService.setDefaultLang("no_nb");
    this._translateService.use("no_nb");
    moment.locale("nb");
  }

  private _activateSection(sectionKey: string) {
    for (let section of this.sections) {
      if (section.titleKey === sectionKey.toUpperCase()) {
        section.active = true;
      } else {
        section.active = false;
      }
    }
  }

  private _setInitalRootPage(sectionKey: string) {
    if (this._appCtrl.getRootNav().first()) {
      return;
    }

    let component = FloodLandslideListPage;
    for (let section of this.sections) {
      if (section.titleKey === sectionKey.toUpperCase()) {
        component = section.component;
      }
    }

    console.log("MyApp: Setting inital root", sectionKey, component.name);
    this._appCtrl.getRootNav().setRoot(component);
    this._splashScreen.hide();
  }

  openSection(section: {
    titleKey: string;
    icon: string;
    active: boolean;
    component: any;
  }) {
    console.log("Open section:", section);
    this._appCtrl.getRootNav().setRoot(section.component);
    this._menu.close();
  }

  launch(url: string) {
    this._iab.create(url, "_system");
  }
}
