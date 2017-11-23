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
    this.regionId = this._navParams.get("regionId");
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

  listHeader(
    warnings: { [k in WarningType]?: RegionWarnings },
    warningIndex: number
  ) {
    if (warnings) {
      const warningTypes = Object.keys(warnings);
      if (
        warningTypes.length > 0 &&
        warnings[warningTypes[0]].warnings.length > warningIndex
      ) {
        const regionWarnings = <RegionWarnings>warnings[warningTypes[0]];
        return regionWarnings.warnings[warningIndex].date;
      }
    }
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

  onWarningSelect($event) {
    console.log(
      `Go to warning of type ${$event.warningType} and day index ${
        $event.dayIndex
      }`
    );
  }
}
