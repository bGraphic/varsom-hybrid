import { Component, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { NavController, Content, NavParams } from "ionic-angular";

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
    private _navParams: NavParams,
    private _store: Store<fromRoot.State>
  ) {
    this.forecasts$ = this._store.select(fromRoot.getForecasts);
    this.regionType$ = this._store.select(fromRoot.getRegionType);
  }

  title(regionType: RegionType) {
    return `OVERVIEW.PAGE_TITLE.${regionType.toUpperCase()}`;
  }

  onSelect($event) {
    this._navCtrl.push(OverviewPage);
  }
}
