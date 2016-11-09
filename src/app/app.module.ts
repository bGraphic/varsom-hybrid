import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { ItemDetailsPage } from '../pages/item-details/region-details';
import { FloodLandslideListPage } from '../pages/list/flood-landslide-list';
import {AvalancheListPage} from "../pages/list/avalanche-list";

@NgModule({
  declarations: [
    MyApp,
    ItemDetailsPage,
    FloodLandslideListPage,
    AvalancheListPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, { })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ItemDetailsPage,
    FloodLandslideListPage,
    AvalancheListPage
  ],
  providers: []
})
export class AppModule {}
