import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MomentModule } from 'angular2-moment';

import { MyApp } from './app.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducer } from './../store/reducers';
import { LocalStorageEffects } from './../store/effects/local-storage.effects';
import { PushEffects } from './../store/effects/push.effects';

import { FloodLandslideListPage } from '../pages/list/flood-landslide-list';
import { AvalancheListPage } from "../pages/list/avalanche-list";
import { AreaDetailsPage } from '../pages/area-details/area-details';
import { WarningDetailsPage } from "../pages/warning-details/warning-details";
import { WarningBadge } from "../partials/warning-badge";
import { Map } from "../partials/map";

import { DataService } from "../providers/data";
import { ForecastService } from "../providers/forecasts";
import { PushService } from "../providers/push";
import { SettingService } from "../providers/settings";
import { AppVersionService } from "../providers/app-version";
import { GeoJsonService } from "../providers/geojson";
import { LocationService } from "../providers/location";
import { StorageService } from "../providers/storage";

import { FilterForecastsPipe, FavoriteForecastsPipe, ForecastsTimeframePipe } from "../pipes/forecasts";

import { FavoriteDirective } from "../directives/favorite";
import { AvalancheRose } from "../partials/avalanche-rose";

import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";

// Must export the config
const firebaseConfig = {
  apiKey: "AIzaSyDwiQkQSv1BCovQiPU-P9xok5pueLPJZqo",
  authDomain: "varsom-dev.firebaseapp.com",
  databaseURL: "https://varsom-dev.firebaseio.com",
  storageBucket: "varsom-dev.appspot.com"
};

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'e7d79d51'
  },
  'push': {
    'sender_id': '123456', // Not supporting android yet
    'pluginConfig': {
      'ios': {
        'alert': true,
        'badge': false,
        'sound': false,
        'clearBadge': true
      },
      'android': {
        'iconColor': '#e46900'
      }
    }
  }
};

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
    IonicModule.forRoot(MyApp, { }),
    CloudModule.forRoot(cloudSettings),
    IonicStorageModule.forRoot(),
    StoreModule.provideStore( reducer ),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    EffectsModule.run(LocalStorageEffects),
    EffectsModule.run(PushEffects),
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
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
    InAppBrowser,
    SplashScreen,
    StatusBar,
    ForecastService,
    DataService,
    SettingService,
    PushService,
    AppVersionService,
    GeoJsonService,
    LocationService,
    StorageService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
