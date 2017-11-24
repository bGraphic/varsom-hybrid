import { Component, ViewChild } from "@angular/core";
import { NavController, NavParams, Content } from "ionic-angular";

import { Observable } from "rxjs/rx";
import { Subscription } from "rxjs/Subscription";
import { Store } from "@ngrx/store";

import { RegionPage } from "../region/region";

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

  regionId: string;
  hasMap: boolean;
  hasMenuButton: boolean;
  section$: Observable<SectionType>;
  segments$: Observable<WarningType[]>;
  selectedSegment$: Observable<WarningType>;
  isMapFullscreen$: Observable<boolean>;
  region$: Observable<Region>;
  private _sectionSubscription: Subscription;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _store: Store<fromRoot.State>
  ) {
    this.regionId = this._navParams.get("regionId");
    this.hasMap = !this.regionId;
    this.hasMenuButton = !this.regionId;
  }

  ngOnInit() {
    this.isMapFullscreen$ = this._store
      .select(fromRoot.getMapSettings)
      .map(mapSetting => mapSetting.isFullscreen);

    this.segments$ = this._store.select(fromRoot.getSegments);

    this.selectedSegment$ = this._store.select(fromRoot.getSelectedSegment);

    this.region$ = this._store.select(fromRoot.getRegion(this.regionId));

    this.section$ = this._store.select(fromRoot.getSelectedSection);

    this._sectionSubscription = this.section$.subscribe(section => {
      if (this.content) {
        this.content.resize();
        this.content.scrollToTop();
      }
    });
  }

  ngOnDestroy() {
    this._sectionSubscription.unsubscribe();
  }

  title(region: Region, sectionType: SectionType) {
    if (region) {
      return region.name;
    } else if (sectionType) {
      return `OVERVIEW.PAGE_TITLE.${sectionType.toUpperCase()}`;
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
    this._store
      .select(fromRoot.getRegion(regionId))
      .first()
      .subscribe(region => {
        if (region.type === "County") {
          this._pushOverviewPage(regionId);
        } else {
          this._pushForecastPage(regionId);
        }
      });
  }

  private _pushOverviewPage(regionId) {
    this._navCtrl.push(OverviewPage, {
      regionId: regionId
    });
  }

  private _pushForecastPage(regionId) {
    this._navCtrl.push(RegionPage, {
      regionId: regionId
    });
  }
}
