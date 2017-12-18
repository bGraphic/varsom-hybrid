import { Component, ViewChild } from "@angular/core";
import { NavController, NavParams, Content } from "ionic-angular";

import { Observable } from "rxjs/rx";
import { Subscription } from "rxjs/Subscription";
import { Store } from "@ngrx/store";

import { RegionPage } from "../region/region";

import * as fromRoot from "./../../store/reducers";
import * as UISectionActions from "./../../store/actions/ui-sections.actions";
import {
  Region,
  OSLO_COUNTY_ID,
  OSLO_MUNICIPALITY_ID
} from "../../store/models/Region";
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
  hasFavoriteButton: boolean;
  section$: Observable<SectionType>;
  segments$: Observable<WarningType[]>;
  selectedSegment$: Observable<WarningType>;
  isMapFullscreen$: Observable<boolean>;
  region$: Observable<Region>;
  fetching$: Observable<boolean>;
  mapOffset: number;

  private _resizeSubscription: Subscription;
  private _scrollToTopSubscription: Subscription;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _store: Store<fromRoot.State>
  ) {
    this.regionId = this._navParams.get("regionId");
    this.hasMap = !this.regionId;
    this.hasMenuButton = !this.regionId;
    this.hasFavoriteButton = !!this.regionId;
  }

  ngOnInit() {
    this.isMapFullscreen$ = this._store
      .select(fromRoot.getMapSettings)
      .map(mapSetting => mapSetting.isFullscreen)
      .distinctUntilChanged();

    this.segments$ = this._store.select(fromRoot.getSegments);

    this.selectedSegment$ = this._store.select(fromRoot.getSelectedSegment);

    this.region$ = this._store.select(fromRoot.getRegion(this.regionId));

    this.section$ = this._store
      .select(fromRoot.getSelectedSection)
      .distinctUntilChanged();

    this.fetching$ = this._store.select(fromRoot.getSectionFetching);

    this._scrollToTopSubscription = this.section$.subscribe(() => {
      this.content.scrollToTop();
    });

    if (this.hasMap) {
      this._resizeSubscription = Observable.combineLatest(
        this.section$,
        this.isMapFullscreen$
      ).subscribe(([section, isFullscreen]) => {
        this.content.resize();

        // Hack to make it happen after resize is done
        setTimeout(() => {
          this.calculateOffset(section, isFullscreen);
        }, 0);
      });
    }
  }

  calculateOffset(section: SectionType, isFullscreen: boolean) {
    if (isFullscreen) {
      this.mapOffset = -this.content.contentTop;
    } else {
      const height = this.content.contentTop + this.content.contentHeight;
      this.mapOffset = -(height * 0.15 + height * 0.35 / 2);
    }
  }

  ngOnDestroy() {
    if (this._resizeSubscription) {
      this._resizeSubscription.unsubscribe();
    }

    if (this._scrollToTopSubscription) {
      this._scrollToTopSubscription.unsubscribe();
    }
  }

  title(region: Region, sectionType: SectionType) {
    if (region) {
      return region.name;
    } else if (sectionType) {
      return `OVERVIEW.PAGE_TITLE.${sectionType.toUpperCase()}`;
    }
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
        if (region.id === OSLO_COUNTY_ID) {
          this._pushForecastPage(OSLO_MUNICIPALITY_ID);
        } else if (region.type === "County") {
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
