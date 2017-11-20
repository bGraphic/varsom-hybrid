import { Component, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { NavController, Content, NavParams } from "ionic-angular";

import { Observable } from "rxjs/rx";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import * as fromRoot from "./../../store/reducers";
import * as SectionActions from "./../../store/actions/ui-sections.actions";
import { RegionImportance, RegionType } from "../../store/models/Region";
import { SectionType } from "../../store/models/Section";
import { WarningType } from "../../store/models/Warning";
import { Forecast } from "../../store/models/Forecast";

@Component({
  templateUrl: "overview.html"
})
export class OverviewPage {
  sectionType: SectionType;
  regionId: string;
  forecasts$: Observable<Forecast[]>;
  segments$: Observable<WarningType[]>;
  selectedSegment$: Observable<WarningType>;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _store: Store<fromRoot.State>
  ) {
    this.sectionType = this._navParams.get("sectionType") || "FloodLandslide";
    this.regionId = this._navParams.get("regionId");

    this.segments$ = this._store.select(
      fromRoot.getSegmentsForSection(this.sectionType)
    );

    this.selectedSegment$ = this._store.select(
      fromRoot.getSelectedSegmentForSection(this.sectionType)
    );

    const forecasts$ = this._store.select(
      fromRoot.getForecastsForSection(this.sectionType, this.regionId)
    );

    this.forecasts$ = Observable.combineLatest(
      forecasts$,
      this.selectedSegment$
    ).map(([forecasts, selectedSegment]) => forecasts[selectedSegment]);
  }

  title(regionType: RegionType) {
    return `OVERVIEW.PAGE_TITLE.${regionType.toUpperCase()}`;
  }

  onSegmentSelect(segment: WarningType) {
    this._store.dispatch(
      new SectionActions.SelectSegment({ segment: segment })
    );
  }

  onForecastSelect(regionId: string) {
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
