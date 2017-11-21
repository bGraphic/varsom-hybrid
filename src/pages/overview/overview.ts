import { Component, ViewChild } from "@angular/core";
import { NavController, NavParams, Content } from "ionic-angular";

import { Observable } from "rxjs/rx";
import { Store } from "@ngrx/store";

import * as fromRoot from "./../../store/reducers";
import * as UISectionActions from "./../../store/actions/ui-sections.actions";
import * as UIMapActions from "./../../store/actions/ui-map.actions";
import { RegionType, Region } from "../../store/models/Region";
import { SectionType } from "../../store/models/Section";
import { WarningType } from "../../store/models/Warning";
import { Forecast } from "../../store/models/Forecast";
import { Position } from "./../../store/models/Location";

@Component({
  templateUrl: "overview.html"
})
export class OverviewPage {
  @ViewChild(Content) content: Content;

  sectionType: SectionType;
  regionId: string;
  position$: Observable<Position>;
  segments$: Observable<WarningType[]>;
  selectedSegment$: Observable<WarningType>;
  mapSettings$: Observable<any>;
  geojson$: Observable<GeoJSON.GeoJsonObject>;
  forecasts$: Observable<Forecast[]>;
  region$: Observable<Region>;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _store: Store<fromRoot.State>
  ) {
    this.sectionType = this._navParams.get("sectionType") || "FloodLandslide";
    this.regionId = this._navParams.get("regionId");

    this.position$ = this._store
      .select(fromRoot.getPosition())
      .do(position => console.log("New position", position));

    this.mapSettings$ = this._store.select(
      fromRoot.getMapSettingsForSection(this.sectionType)
    );

    this.segments$ = this._store.select(
      fromRoot.getSegmentsForSection(this.sectionType)
    );

    this.selectedSegment$ = this._store.select(
      fromRoot.getSelectedSegmentForSection(this.sectionType)
    );

    this.region$ = this._store.select(
      fromRoot.getRegionForSection(this.sectionType, this.regionId)
    );

    this.geojson$ = this._store.select(
      fromRoot.getGeojsonForSection(this.sectionType)
    );

    const forecasts$ = this._store.select(
      fromRoot.getForecastsForSection(this.sectionType, this.regionId)
    );

    this.forecasts$ = Observable.combineLatest(
      forecasts$,
      this.selectedSegment$
    ).map(([forecasts, selectedSegment]) => forecasts[selectedSegment]);
  }

  title(region: Region) {
    if (region) {
      return region.name;
    } else {
      return `OVERVIEW.PAGE_TITLE.${this.sectionType.toUpperCase()}`;
    }
  }

  mapOffset(isFullscreen) {
    if (isFullscreen) {
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

  onMapFullscreenToggle() {
    this._store.dispatch(
      new UIMapActions.ToogleFullscreen({ mapKey: "AVALANCHE" })
    );
  }

  onMapCenterOnMarker() {
    this._store.dispatch(
      new UIMapActions.RequestRecenter({ mapKey: "AVALANCHE" })
    );
  }

  onMapIsCenterUpdated(isCentered: boolean) {
    this._store.dispatch(
      new UIMapActions.IsCenteredUpdate({ mapKey: "AVALANCHE", isCentered })
    );
  }

  private _pushOverviewPage(regionId) {
    this._navCtrl.push(OverviewPage, {
      sectionType: this.sectionType,
      regionId: regionId
    });
  }

  private _pushForecastPage(regionId) {}
}
