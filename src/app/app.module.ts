import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { FloodLandslideListPage } from '../pages/list/flood-landslide-list';
import { AvalancheListPage } from "../pages/list/avalanche-list";
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { WarningBadge } from "../partials/warning-badge";
import { Map } from "../partials/map";
import { DataService } from "../services/data";
import { AngularFireModule } from 'angularfire2';
import {SettingsService} from "../services/settings";

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
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FloodLandslideListPage,
    AvalancheListPage,
    ItemDetailsPage
  ],
  providers: [DataService, SettingsService, {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
