import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';

import { MyApp } from './app.component';
import { FloodLandslideListPage } from '../pages/list/flood-landslide-list';
import { AvalancheListPage } from "../pages/list/avalanche-list";
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { WarningBadge } from "../partials/warning-badge";
import { Map } from "../partials/map";
import { DataService } from "../services/data";
import { AngularFireModule } from 'angularfire2';
import { SettingsService } from "../services/settings";
import { Theme } from "../providers/theme";

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyDwiQkQSv1BCovQiPU-P9xok5pueLPJZqo",
  authDomain: "varsom-dev.firebaseapp.com",
  databaseURL: "https://varsom-dev.firebaseio.com",
  storageBucket: "varsom-dev.appspot.com"
};

@NgModule({
  declarations: [
    MyApp,
    FloodLandslideListPage,
    AvalancheListPage,
    ItemDetailsPage,
    WarningBadge,
    Map
  ],
  imports: [
    IonicModule.forRoot(MyApp, { }),
    BrowserModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FloodLandslideListPage,
    AvalancheListPage,
    ItemDetailsPage
  ],
  providers: [DataService, SettingsService, Theme, {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
