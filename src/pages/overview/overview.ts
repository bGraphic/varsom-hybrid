import { Component, ViewChild } from "@angular/core";
import { NavController, Content } from "ionic-angular";

import { Observable } from "rxjs/rx";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import * as fromRoot from "./../../store/reducers";
import { Forecast } from "./../../store/models/Warning";
import * as RegionsActions from "./../../store/actions/regions.actions";
import * as WarningsActions from "./../../store/actions/warnings.actions";
import { RegionImportance } from "../../store/models/Region";

@Component({
  templateUrl: "overview.html"
})
export class OverviewPage {
  forecasts$: Observable<Forecast[]>;

  constructor(
    private _navCtrl: NavController,
    private _store: Store<fromRoot.State>
  ) {
    this.forecasts$ = this._store.select(fromRoot.getForecasts);
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

  active(forecasts: Forecast[]) {
    return forecasts.filter(forecast => {
      return forecast.warnings.reduce(
        (acc, warning) => warning.rating > 1,
        false
      );
    });
  }

  activeB(forecasts: Forecast[]) {
    return this.active(this.allB(forecasts));
  }

  allA(forecasts: Forecast[]) {
    return forecasts.filter(
      forecast => forecast.regionImportance === RegionImportance.A
    );
  }

  allB(forecasts: Forecast[]) {
    return forecasts.filter(
      forecast => forecast.regionImportance === RegionImportance.B
    );
  }
}
