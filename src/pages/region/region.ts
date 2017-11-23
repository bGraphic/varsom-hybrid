import { Component } from "@angular/core";
import { NavParams } from "ionic-angular";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import * as fromRoot from "./../../store/reducers";
import { Region } from "../../store/models/Region";
import { WarningType, RegionWarnings } from "../../store/models/Warning";
import { Warning } from "../../store/models/Warning";

@Component({
  templateUrl: "region.html"
})
export class RegionPage {
  regionId: string;
  region$: Observable<Region>;
  warnings$: Observable<{ [k in WarningType]?: RegionWarnings }>;
  constructor(
    private _navParams: NavParams,
    private _store: Store<fromRoot.State>
  ) {
    this.regionId = this._navParams.get("regionId") || "1228";
  }

  ngOnInit() {
    this.region$ = this._store.select(fromRoot.getRegion(this.regionId));
    this.warnings$ = this._store
      .select(fromRoot.getRegionWarnings(this.regionId))
      .do(warnings => console.log("Warnings", warnings));
  }

  title(region: Region) {
    if (region) {
      return region.name;
    }
  }

  listHeader(warnings: RegionWarnings[]) {
    return "List header";
  }

  warningTypes(region: Region): WarningType[] {
    if (!region) {
      return [];
    } else if (region.type === "AvalancheRegion") {
      return ["Avalanche"];
    } else {
      return ["Flood", "Landslide"];
    }
  }

  rating(
    warnings: RegionWarnings[],
    warningType: WarningType,
    warningIndex: number
  ) {
    const warning = this._warning(warnings, warningType, warningIndex);
    if (warning) {
      return warning.rating;
    }
  }

  mainText(
    warnings: RegionWarnings[],
    warningType: WarningType,
    warningIndex: number
  ) {
    const warning = this._warning(warnings, warningType, warningIndex);
    if (warning && warning.meta) {
      return warning.meta.MainText;
    }
  }

  onSelect(
    warnings: { [k in WarningType]?: RegionWarnings },
    warningType,
    dayIndex
  ) {
    console.log(
      `Go to warning of type ${warningType} and day index ${dayIndex}`
    );
  }

  _warning(
    warnings: RegionWarnings[],
    warningType: WarningType,
    warningIndex: number
  ): Warning {
    if (
      warnings &&
      warnings[warningType] &&
      warnings[warningType].warnings.length > warningIndex
    ) {
      return warnings[warningType].warnings[warningIndex];
    }
  }
}
