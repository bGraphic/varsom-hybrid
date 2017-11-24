import { Component } from "@angular/core";
import { NavParams } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";

import * as fromRoot from "./../../store/reducers";
import { Region } from "../../store/models/Region";
import { WarningType, Warning } from "../../store/models/Warning";

@Component({
  templateUrl: "warning.html"
})
export class WarningPage {
  regionId: string;
  warningType: WarningType;
  region$: Observable<Region>;
  warning$: Observable<Warning>;

  private _warningIndex: number;

  constructor(
    private _navParams: NavParams,
    private _store: Store<fromRoot.State>
  ) {
    this.regionId = this._navParams.get("regionId");
    this.warningType = this._navParams.get("warningType");
    this._warningIndex = this._navParams.get("warningIndex");
  }

  ngOnInit() {
    this.region$ = this._store.select(fromRoot.getRegion(this.regionId));
    this.warning$ = this._store
      .select(fromRoot.getRegionWarnings(this.regionId))
      .map(warnings => {
        if (
          warnings &&
          warnings[this.warningType] &&
          warnings[this.warningType].warnings.length > this._warningIndex
        ) {
          return warnings[this.warningType].warnings[this._warningIndex];
        }
      });
  }

  title(region: Region) {
    if (region) {
      return region.name;
    }
  }
}
