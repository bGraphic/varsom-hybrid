import { Component, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { NavController, Content, NavParams } from "ionic-angular";

import { Observable } from "rxjs/rx";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import * as fromRoot from "./../../store/reducers";
import { Forecast } from "./../../store/models/Forecast";
import * as RegionsActions from "./../../store/actions/regions.actions";
import * as WarningsActions from "./../../store/actions/warnings.actions";
import { RegionImportance, RegionType } from "../../store/models/Region";
import { SectionType } from "../../store/models/Section";

@Component({
  templateUrl: "overview.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewPage {
  sectionType: SectionType;
  regionId: string;
  forecasts$: Observable<Forecast[]>;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _store: Store<fromRoot.State>
  ) {
    this.sectionType = this._navParams.get("sectionType") || "FloodLandslide";
    this.regionId = this._navParams.get("regionId");

    this.forecasts$ = this._store
      .select(fromRoot.getForecastsForSection(this.sectionType))
      .map(forecasts => {
        if (this.sectionType === "FloodLandslide") {
          if (!this.regionId) {
            return forecasts.filter(
              forecast => forecast.regionType === "County"
            );
          } else {
            return forecasts.filter(
              forecast =>
                forecast.regionType === "Municipality" &&
                forecast.regionId.startsWith(this.regionId)
            );
          }
        }
        return forecasts;
      })
      .do(forecasts => console.log("Forecasts", forecasts));
  }

  title(regionType: RegionType) {
    return `OVERVIEW.PAGE_TITLE.${regionType.toUpperCase()}`;
  }

  onSelect({ regionId }) {
    if (this.sectionType === "FloodLandslide" && !this.regionId) {
      this._pushOverviewPage(regionId);
    }

    this._pushForecastPage(regionId);
  }

  private _pushOverviewPage(regionId) {
    this._navCtrl.push(OverviewPage, {
      sectionType: this.sectionType,
      regionId: regionId
    });
  }

  private _pushForecastPage(regionId) {}
}
