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

import { FloodLandslideListPage } from "../pages/list/flood-landslide-list";
import { AvalancheListPage } from "../pages/list/avalanche-list";
import { AreaDetailsPage } from "../pages/area-details/area-details";
import { WarningDetailsPage } from "../pages/warning-details/warning-details";
import { WarningBadge } from "../partials/warning-badge";

import { DataService } from "../providers/data";
import { ForecastService } from "../providers/forecasts";
import { FavoriteService } from "../providers/favorites";
import { PushService } from "../providers/push";
import { SettingService } from "../providers/settings";
import { AppVersionService } from "../providers/app-version";
import { GeoJsonService } from "../providers/geojson";
import { StorageService } from "../providers/storage";

import { reducer } from "./../store/reducers";
import { LocationEffects } from "./../store/effects/location.effects";
import { WarningsEffects } from "./../store/effects/warnings.effects";

import {
  FilterForecastsPipe,
  FavoriteForecastsPipe,
  ForecastsTimeframePipe
} from "../pipes/forecasts";

import { MapDirective } from "../directives/map";
import { FavoriteDirective } from "../directives/favorite";
import { AvalancheRose } from "../partials/avalanche-rose";

import { AppVersion } from "@ionic-native/app-version";
import { Diagnostic } from "@ionic-native/diagnostic";
import { Geolocation } from "@ionic-native/geolocation";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { DataService as NewDataService } from "../store/services/data.service";
import { RegionsEffects } from "../store/effects/regions.effects";

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    MyApp,
    FloodLandslideListPage,
    AvalancheListPage,
    AreaDetailsPage,
    WarningDetailsPage,
    WarningBadge,
    MapDirective,
    AvalancheRose,
    FavoriteDirective,
    FilterForecastsPipe,
    FavoriteForecastsPipe,
    ForecastsTimeframePipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {}),
    CloudModule.forRoot(ionicCloud),
    IonicStorageModule.forRoot(),
    StoreModule.provideStore(reducer),
    EffectsModule.run(LocationEffects),
    EffectsModule.run(RegionsEffects),
    EffectsModule.run(WarningsEffects),
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
  entryComponents: [
    MyApp,
    FloodLandslideListPage,
    AvalancheListPage,
    AreaDetailsPage,
    WarningDetailsPage
  ],
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
    StorageService,
    NewDataService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
