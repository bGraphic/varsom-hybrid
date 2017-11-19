import { Component, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { NavController, Content } from "ionic-angular";

import { Observable } from "rxjs/rx";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import * as fromRoot from "./../../store/reducers";
import { Forecast } from "./../../store/models/Warning";
import * as RegionsActions from "./../../store/actions/regions.actions";
import * as WarningsActions from "./../../store/actions/warnings.actions";
import { RegionImportance, RegionType } from "../../store/models/Region";

@Component({
  templateUrl: "overview.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewPage {
  forecasts$: Observable<Forecast[]>;
  regionType$: Observable<RegionType>;

  constructor(
    private _navCtrl: NavController,
    private _store: Store<fromRoot.State>
  ) {
    this.forecasts$ = this._store.select(fromRoot.getForecasts);
    this.regionType$ = this._store.select(fromRoot.getRegionType);
  }

  ionViewDidEnter() {
    this._store.dispatch(
      new RegionsActions.SelectAction({
        regionType: "County"
      })
    );

    this._store.dispatch(
      new WarningsActions.SelectAction({
        warningType: "FloodLandslide"
      })
    );
  }

  title(regionType: RegionType) {
    return `OVERVIEW.PAGE_TITLE.${regionType.toUpperCase()}`;
  }

  onSelect($event) {
    console.log("ON SELECT", $event);
  }
}
