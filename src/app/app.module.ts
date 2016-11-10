import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { RegionDetailsPage } from '../pages/item-details/region-details';
import { FloodLandslideListPage } from '../pages/list/flood-landslide-list';
import { AvalancheListPage } from "../pages/list/avalanche-list";
import { MuncipalityDetailsPage } from "../pages/item-details/municipality-details";
import { WarningBadge } from "../partials/warning-badge";

@NgModule({
  declarations: [
    MyApp,
    MuncipalityDetailsPage,
    RegionDetailsPage,
    FloodLandslideListPage,
    AvalancheListPage,
    WarningBadge
  ],
  imports: [
    IonicModule.forRoot(MyApp, { })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MuncipalityDetailsPage,
    RegionDetailsPage,
    FloodLandslideListPage,
    AvalancheListPage
  ],
  providers: []
})
export class AppModule {}
