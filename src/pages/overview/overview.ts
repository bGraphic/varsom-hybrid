import { Component, ViewChild } from "@angular/core";
import { NavController, NavParams, Content } from "ionic-angular";

import { Observable } from "rxjs/rx";
import { Store } from "@ngrx/store";

import * as fromRoot from "./../../store/reducers";
import * as UISectionActions from "./../../store/actions/ui-sections.actions";
import { Region } from "../../store/models/Region";
import { SectionType } from "../../store/models/Section";
import { WarningType } from "../../store/models/Warning";

@Component({
  templateUrl: "overview.html"
})
export class OverviewPage {
  @ViewChild(Content) content: Content;

  sectionType: SectionType;
  regionId: string;
  hasMap: boolean;
  hasMenuButton: boolean;
  segments$: Observable<WarningType[]>;
  selectedSegment$: Observable<WarningType>;
  isMapFullscreen$: Observable<boolean>;
  region$: Observable<Region>;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _store: Store<fromRoot.State>
  ) {
    this.sectionType = this._navParams.get("sectionType") || "FloodLandslide";
    this.regionId = this._navParams.get("regionId");
    this.hasMap = !this.regionId;
    this.hasMenuButton = !this.regionId;

    this.isMapFullscreen$ = this._store
      .select(fromRoot.getMapSettings)
      .map(mapSetting => mapSetting.isFullscreen);

    this.segments$ = this._store.select(fromRoot.getSegments);

    this.selectedSegment$ = this._store.select(fromRoot.getSelectedSegment);

    this.region$ = this._store.select(fromRoot.getRegion(this.regionId));
  }

  ionViewDidEnter() {
    this._store.select(fromRoot.getSelectedSection).subscribe(section => {
      this.content.resize();
    });
  }

  title(region: Region) {
    if (region) {
      return region.name;
    } else {
      return `OVERVIEW.PAGE_TITLE.${this.sectionType.toUpperCase()}`;
    }
  }

  mapOffset(mapFullscreen) {
    if (mapFullscreen) {
      return 0;
    }

    const height = this.content.contentTop + this.content.contentHeight;
    return -(height * 0.15 + height * 0.35 / 2 - this.content.contentTop);
  }

  onSegmentSelect(segment: WarningType) {
    this._store.dispatch(
      new UISectionActions.SelectSegment({ segment: segment })
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
