import { Component } from "@angular/core";
import { NavParams } from "ionic-angular";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import * as fromRoot from "./../../store/reducers";
import { Region } from "../../store/models/Region";

@Component({
  templateUrl: "region.html"
})
export class RegionPage {
  regionId: string;
  region$: Observable<Region>;
  constructor(
    private _navParams: NavParams,
    private _store: Store<fromRoot.State>
  ) {
    this.regionId = this._navParams.get("regionId");
  }

  ngOnInit() {
    this.region$ = this._store.select(fromRoot.getRegion(this.regionId));
  }
}
