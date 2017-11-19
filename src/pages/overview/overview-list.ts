import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Forecast } from "../../store/models/Warning";
import { RegionType, RegionImportance } from "../../store/models/Region";

@Component({
  selector: "overview-list",
  templateUrl: "overview-list.html"
})
export class OverviewList {
  @Input() forecasts: Forecast[];
  @Input() regionType: RegionType;
  @Output() onSelect = new EventEmitter();

  constructor() {}

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
