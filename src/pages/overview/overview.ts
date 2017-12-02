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
  hasFavoriteButton: boolean;
  section$: Observable<SectionType>;
  segments$: Observable<WarningType[]>;
  selectedSegment$: Observable<WarningType>;
  isMapFullscreen$: Observable<boolean>;
  region$: Observable<Region>;
  fetching$: Observable<boolean>;
  mapOffset: number;

  private _resizeSubscription: Subscription;

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
      .map(mapSetting => mapSetting.isFullscreen);

    this.segments$ = this._store.select(fromRoot.getSegments);

    this.selectedSegment$ = this._store.select(fromRoot.getSelectedSegment);

    this.region$ = this._store.select(fromRoot.getRegion(this.regionId));

    this.section$ = this._store.select(fromRoot.getSelectedSection);

    this.fetching$ = this._store.select(fromRoot.getSectionFetching);

    this._resizeSubscription = Observable.combineLatest(
      this.section$,
      this.isMapFullscreen$
    ).subscribe(([section, isFullscreen]) => {
      if (this.content) {
        this.content.resize();
        this.content.scrollToTop();
      }

      const contentTop = section === "Avalanche" ? 55 : 111; // this.content.contentTop;

      if (isFullscreen) {
        this.mapOffset = -contentTop;
      } else {
        const height = contentTop + this.content.contentHeight;
        this.mapOffset = -(height * 0.15 + height * 0.35 / 2); // - this.content.contentTop);
      }
    });
  }

  ngOnDestroy() {
    this._resizeSubscription.unsubscribe();
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
