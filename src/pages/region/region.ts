import { Component } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import * as fromRoot from "./../../store/reducers";
import { Region } from "../../store/models/Region";
import { WarningType, RegionWarnings } from "../../store/models/Warning";
import { WarningPage } from "../warning/warning";

@Component({
  templateUrl: "region.html"
})
export class RegionPage {
  regionId: string;
  region$: Observable<Region>;
  warnings$: Observable<{ [k in WarningType]?: RegionWarnings }>;
  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _store: Store<fromRoot.State>
  ) {
    this.regionId = this._navParams.get("regionId");
  }

  ngOnInit() {
    this.region$ = this._store.select(fromRoot.getRegion(this.regionId));
    this.warnings$ = this._store.select(
      fromRoot.getRegionWarnings(this.regionId)
    );
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

  onWarningSelect({ warningType, warningIndex }) {
    this._navCtrl.push(WarningPage, {
      regionId: this.regionId,
      warningType: warningType,
      warningIndex: warningIndex
    });
  }
}
