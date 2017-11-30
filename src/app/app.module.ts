import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { NgModule, ErrorHandler } from "@angular/core";
import { HttpModule, Http } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { CloudModule } from "@ionic/cloud-angular";
import { IonicStorageModule } from "@ionic/storage";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MomentModule } from "angular2-moment";

import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { MyApp } from "./app.component";
import { firebase, ionicCloud } from "./../config/config";

import { OverviewPage } from "../pages/overview/overview";
import { OverviewMap } from "../pages/overview/overview-map";
import { OverviewList } from "../pages/overview/overview-list";
import { OverviewListSection } from "../pages/overview/overview-list-section";
import { OverviewSegments } from "../pages/overview/overview-segments";
import { OverviewMapControls } from "../pages/overview/overview-map-controls";
import { RegionPage } from "../pages/region/region";
import { RegionWarning } from "../pages/region/region-warning";
import { WarningPage } from "../pages/warning/warning";
import { WarningDetails } from "../pages/warning/warning-details";
import { WarningBadge } from "../partials/warning-badge";

import { DataService } from "../providers/data";
import { ForecastService } from "../providers/forecasts";
import { FavoriteService } from "../providers/favorites";
import { PushService } from "../providers/push";
import { SettingService } from "../providers/settings";
import { AppVersionService } from "../providers/app-version";
import { GeoJsonService } from "../providers/geojson";
import { StorageService } from "../providers/storage";
import { DataService as NewDataService } from "../store/services/data.service";
import { GeojsonService as NewGeojsonService } from "../store/services/geojson.service";

import { reducer } from "./../store/reducers";
import { AppVersionsEffects } from "../store/effects/app-versions.effects";
import { LocationEffects } from "./../store/effects/location.effects";
import { LocalStorageEffects } from "../store/effects/localstorage.effects";
import { WarningsEffects } from "./../store/effects/warnings.effects";
import { RegionsEffects } from "../store/effects/regions.effects";
import { GeojsonEffects } from "../store/effects/geojson.effects";
import { UIAlertsEffects } from "../store/effects/ui-alerts.effects";

import { MapDirective } from "../directives/map";
import { FavoriteDirective } from "../directives/favorite";
import { AvalancheRose } from "../partials/avalanche-rose";

import { AppVersion } from "@ionic-native/app-version";
import { Diagnostic } from "@ionic-native/diagnostic";
import { Geolocation } from "@ionic-native/geolocation";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    MyApp,
    OverviewPage,
    OverviewMap,
    OverviewMapControls,
    OverviewSegments,
    OverviewList,
    OverviewListSection,
    RegionPage,
    RegionWarning,
    WarningPage,
    WarningDetails,
    WarningBadge,
    MapDirective,
    AvalancheRose,
    FavoriteDirective
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {}),
    CloudModule.forRoot(ionicCloud),
    IonicStorageModule.forRoot(),
    StoreModule.provideStore(reducer),
    EffectsModule.run(GeojsonEffects),
    EffectsModule.run(RegionsEffects),
    EffectsModule.run(WarningsEffects),
    EffectsModule.run(LocationEffects),
    EffectsModule.run(LocalStorageEffects),
    EffectsModule.run(AppVersionsEffects),
    EffectsModule.run(UIAlertsEffects),
    HttpModule,
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    AngularFireModule.initializeApp(firebase),
    AngularFireDatabaseModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
      }
    }),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, OverviewPage, RegionPage, WarningPage],
  providers: [
    AppVersion,
    Diagnostic,
    Geolocation,
    InAppBrowser,
    SplashScreen,
    StatusBar,
    Geolocation,
    ForecastService,
    DataService,
    SettingService,
    FavoriteService,
    PushService,
    AppVersionService,
    GeoJsonService,
    NewDataService,
    NewGeojsonService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
