import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import { Forecast } from "../../store/models/Forecast";
import { RegionImportance } from "../../store/models/Region";
import { SectionType } from "../../store/models/Section";

import * as fromRoot from "./../../store/reducers";

@Component({
  selector: "overview-list",
  templateUrl: "overview-list.html"
})
export class OverviewList {
  @Input() regionId: string;
  @Output() onSelect = new EventEmitter();
  forecasts$: Observable<Forecast[]>;
  favoriteForecasts$: Observable<Forecast[]>;
  section$: Observable<SectionType>;

  constructor(private _store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.forecasts$ = this._store.select(
      fromRoot.getOverviewListForecasts(this.regionId)
    );
    this.favoriteForecasts$ = this._store.select(
      fromRoot.getFavoritesListForecasts(this.regionId)
    );
    this.section$ = this._store.select(fromRoot.getSelectedSection);
  }

  headerFavorites(sectionType: SectionType) {
    return this.translationKey("LIST_HEADER.FAVORITES", sectionType);
  }

  activeB(forecasts: Forecast[]) {
    return this.active(this.allB(forecasts));
  }

  headerActiveB(sectionType: SectionType) {
    return this.translationKey("LIST_HEADER.B_REGIONS_ACTIVE", sectionType);
  }

  allA(forecasts: Forecast[]) {
    return forecasts.filter(
      forecast => forecast.regionImportance === RegionImportance.A
    );
  }

  headerAllA(sectionType: SectionType) {
    return this.translationKey("LIST_HEADER.A_REGIONS", sectionType);
  }

  allB(forecasts: Forecast[]) {
    return forecasts.filter(
      forecast => forecast.regionImportance === RegionImportance.B
    );
  }

  headerAllB(sectionType: SectionType) {
    return this.translationKey("LIST_HEADER.B_REGIONS", sectionType);
  }

  private active(forecasts: Forecast[]) {
    return forecasts.filter(forecast => {
      return forecast.highestRating > 1;
    });
  }

  private translationKey(key: string, sectionType: SectionType) {
    if (sectionType) {
      return `OVERVIEW.${key}.${sectionType.toUpperCase()}`;
    }
    return "";
  }
}
