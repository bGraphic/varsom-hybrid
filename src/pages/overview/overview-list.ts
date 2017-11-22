import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import { Forecast } from "../../store/models/Forecast";
import { RegionType, RegionImportance } from "../../store/models/Region";
import { SectionType } from "../../store/models/Section";

import * as fromRoot from "./../../store/reducers";

@Component({
  selector: "overview-list",
  templateUrl: "overview-list.html"
})
export class OverviewList {
  @Input() sectionType: SectionType;
  @Input() regionId: string;
  @Output() onSelect = new EventEmitter();
  forecasts$: Observable<Forecast[]>;

  constructor(private _store: Store<fromRoot.State>) {}

  ngOnInit() {
    const selectedSegment$ = this._store.select(
      fromRoot.getSelectedSegmentForSection(this.sectionType)
    );

    const forecasts$ = this._store.select(
      fromRoot.getForecastsForSection(this.sectionType, this.regionId)
    );

    this.forecasts$ = Observable.combineLatest(
      forecasts$,
      selectedSegment$
    ).map(([forecasts, selectedSegment]) => forecasts[selectedSegment]);
  }

  activeB(forecasts: Forecast[]) {
    return this.active(this.allB(forecasts));
  }

  headerActiveB(regionType: RegionType) {
    return this.translationKey("LIST_HEADER.B_REGIONS_ACTIVE", regionType);
  }

  allA(forecasts: Forecast[]) {
    return forecasts.filter(
      forecast => forecast.regionImportance === RegionImportance.A
    );
  }

  headerAllA(regionType: RegionType) {
    return this.translationKey("LIST_HEADER.A_REGIONS", regionType);
  }

  allB(forecasts: Forecast[]) {
    return forecasts.filter(
      forecast => forecast.regionImportance === RegionImportance.B
    );
  }

  headerAllB(regionType: RegionType) {
    return this.translationKey("LIST_HEADER.B_REGIONS", regionType);
  }

  private active(forecasts: Forecast[]) {
    return forecasts.filter(forecast => {
      return forecast.warnings.reduce(
        (acc, warning) => warning.rating > 1,
        false
      );
    });
  }

  private translationKey(key: string, regionType: RegionType) {
    if (regionType) {
      return `OVERVIEW.${key}.${regionType.toUpperCase()}`;
    }
    return "";
  }
}
