import { Component } from "@angular/core";
import { NavParams } from "ionic-angular";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import * as fromRoot from "./../../store/reducers";
import { Region } from "../../store/models/Region";
import { WarningType, RegionWarnings } from "../../store/models/Warning";

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
}
