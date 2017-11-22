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
import * as UISectionActions from "./../store/actions/ui-sections.actions";
import * as WarningsActions from "./../store/actions/warnings.actions";
import * as RegionsActions from "./../store/actions/regions.actions";

// import { PushService } from "../providers/push";
import { SettingService } from "../providers/settings";
import { AppVersionService } from "../providers/app-version";
import { OverviewPage } from "../pages/overview/overview";
import { SectionType } from "../store/models/Section";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = OverviewPage;
  sections$: Observable<SectionType[]>;
  selectedSection$: Observable<SectionType>;
  externalLinks$: Observable<{
    url: string;
    label: string;
    description: string;
  }>;
  contactLinks$: Observable<{
    url: string;
    label: string;
    description: string;
  }>;
  logoLinks$: Observable<
    {
      header: string;
      list: string[];
    }[]
  >;

  constructor(
    public platform: Platform,
    private _appCtrl: App,
    private _menu: MenuController,
    private _config: Config,
    private _translateService: TranslateService,
    private _splashScreen: SplashScreen,
    private _statusBar: StatusBar,
    private _iab: InAppBrowser,
    private _store: Store<fromRoot.State>
  ) {
    this._translateService.setDefaultLang("no_nb");
    this._translateService.use("no_nb");
    moment.locale("nb");

    this.initializeApp();
    this.initializeData();

    this.sections$ = this._store.select(fromRoot.getSections);
    this.selectedSection$ = this._store.select(fromRoot.getSelectedSection);

    this.externalLinks$ = this._translateService.get("MENU.EXTERNAL.ITEMS");
    this.contactLinks$ = this._translateService.get("MENU.CONTACT_INFO.ITEMS");
    this.logoLinks$ = this._translateService
      .get("LOGOS")
      .map((res: { [key: string]: { HEADER: string; LIST: string[] } }) => {
        return Object.keys(res).reduce((logos, key) => {
          logos.push({
            header: res[key].HEADER,
            list: res[key].LIST
          });
          return logos;
        }, []);
      });
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this._statusBar.styleDefault();
      // this._pushService.register();
      this._translateService.get("BACK").subscribe((res: string) => {
        this._config.set("ios", "backButtonText", res);
      });
    });
  }

  private initializeData() {
    this._store.dispatch(
      new RegionsActions.FetchAction({ sectionType: "Avalanche" })
    );
    this._store.dispatch(
      new RegionsActions.FetchAction({ sectionType: "FloodLandslide" })
    );
    this._store.dispatch(
      new WarningsActions.FetchAction({ warningType: "Avalanche" })
    );
    this._store.dispatch(
      new WarningsActions.FetchAction({ warningType: "Flood" })
    );
    this._store.dispatch(
      new WarningsActions.FetchAction({ warningType: "Landslide" })
    );
  }

  selectSection(section: SectionType) {
    this._store.dispatch(
      new UISectionActions.SelectSection({ section: section })
    );
    this.nav.setRoot(OverviewPage);
  }

  launch(url: string) {
    this._iab.create(url, "_system");
  }

  icon(sectionType: SectionType) {
    switch (sectionType) {
      case "FloodLandslide":
        return "rainy";
      case "Avalanche":
        return "snow";
    }
  }
}
