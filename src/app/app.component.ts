import { Component, ViewChild } from "@angular/core";
import { Platform, Nav, Config } from "ionic-angular";
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

import { OverviewPage } from "../pages/overview/overview";
import { SectionType } from "../store/models/Section";

interface ExternalLink {
  url: string;
  label?: string;
  description?: string;
}

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  sections$: Observable<SectionType[]>;
  selectedSection$: Observable<SectionType>;
  externalLinks$: Observable<ExternalLink[]>;
  contactLinks$: Observable<ExternalLink[]>;
  logoLinks$: Observable<
    {
      header: string;
      list: string[];
    }[]
  >;

  constructor(
    public platform: Platform,
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

    this.platform.ready().then(() => {
      this._statusBar.styleDefault();
      this._translateService.get("BACK").subscribe((res: string) => {
        this._config.set("ios", "backButtonText", res);
      });
    });

    this.sections$ = this._store.select(fromRoot.getSections);
    this.selectedSection$ = this._store
      .select(fromRoot.getSelectedSection)
      .filter(section => !!section);

    this.selectedSection$.first().subscribe(section => {
      this.rootPage = OverviewPage;
      this._splashScreen.hide();
    });

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

  selectSection(section: SectionType) {
    this._store.dispatch(
      new UISectionActions.SelectSection({ section: section })
    );
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
