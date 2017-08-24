import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { CloudModule } from '@ionic/cloud-angular';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MomentModule } from 'angular2-moment';

import { MyApp } from './app.component';
import { firebase, ionicCloud } from './../config/config'

import { FloodLandslideListPage } from '../pages/list/flood-landslide-list';
import { AvalancheListPage } from "../pages/list/avalanche-list";
import { AreaDetailsPage } from '../pages/area-details/area-details';
import { WarningDetailsPage } from "../pages/warning-details/warning-details";
import { WarningBadge } from "../partials/warning-badge";
import { Map } from "../partials/map";

import { DataService } from "../providers/data";
import { ForecastService } from "../providers/forecasts";
import { FavoriteService } from "../providers/favorites";
import { PushService } from "../providers/push";
import { SettingService } from "../providers/settings";
import { AppVersionService } from "../providers/app-version";
import { GeoJsonService } from "../providers/geojson";
import { LocationService } from "../providers/location";
import { StorageService } from "../providers/storage";

import { StoreModule } from '@ngrx/store';
import { LocationReducer } from '../store/reducers/location.reducer';
import { LocationActions } from '../store/actions/location.actions';

import { FilterForecastsPipe, FavoriteForecastsPipe, ForecastsTimeframePipe } from "../pipes/forecasts";

import { FavoriteDirective } from "../directives/favorite";
import { AvalancheRose } from "../partials/avalanche-rose";

import { AppVersion } from '@ionic-native/app-version';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    FloodLandslideListPage,
    AvalancheListPage,
    AreaDetailsPage,
    WarningDetailsPage,
    WarningBadge,
    Map,
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
    StoreModule.provideStore({ loaction: LocationReducer }),
    HttpModule,
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
    LocationService,
    StorageService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LocationActions
  ]
})
export class AppModule { }
