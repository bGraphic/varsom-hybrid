import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { Storage } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { MomentModule } from 'angular2-moment';

import { MyApp } from './app.component';

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

import { FilterForecastsPipe, FavoriteForecastsPipe, ForecastsTimeframePipe } from "../pipes/forecasts";

import { FavoriteDirective } from "../directives/favorite";
import {AvalancheRose} from "../partials/avalanche-rose";

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
    IonicModule.forRoot(MyApp, { }),
    CloudModule.forRoot(cloudSettings),
    BrowserModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
      deps: [Http]
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
    Storage,
    ForecastService,
    DataService,
    SettingService,
    FavoriteService,
    PushService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
