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
import { ThemeUtils } from "../../utils/theme-utils";

@Component({
  templateUrl: "overview.html"
})
export class OverviewPage {
  @ViewChild(Content) content: Content;

  sectionType: SectionType;
  regionId: string;
  hasMap: boolean;
  position$: Observable<Position>;
  segments$: Observable<WarningType[]>;
  selectedSegment$: Observable<WarningType>;
  mapSettings$: Observable<any>;
  geojsonForecasts$: Observable<any[]>;
  forecasts$: Observable<Forecast[]>;
  region$: Observable<Region>;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _store: Store<fromRoot.State>
  ) {
    this.sectionType = this._navParams.get("sectionType") || "Avalanche";
    this.regionId = this._navParams.get("regionId");
    this.hasMap = !this.regionId;

    this.position$ = this._store.select(fromRoot.getPosition());

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

    const geojson$ = this._store.select(
      fromRoot.getGeojsonForSection(this.sectionType)
    );

    const forecasts$ = this._store.select(
      fromRoot.getForecastsForSection(this.sectionType, this.regionId)
    );

    this.forecasts$ = Observable.combineLatest(
      forecasts$,
      this.selectedSegment$
    ).map(([forecasts, selectedSegment]) => forecasts[selectedSegment]);

    this.geojsonForecasts$ = Observable.combineLatest(
      geojson$,
      this.forecasts$
    ).map(([geojson, forecasts]) => {
      return geojson.map(feature => {
        const forecast = forecasts.find(
          forecast => forecast.regionId === feature.properties.regionId
        );
        const properties = {
          ...feature.properties,
          color: forecast
            ? ThemeUtils.colorForRating(forecast.highestRating)
            : ThemeUtils.colorForRating(0)
        };
        return {
          type: feature.type,
          properties: properties,
          geometry: feature.geometry
        };
      });
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

  onToggleMapFullscreen() {
    this._store.dispatch(
      new UIMapActions.ToogleFullscreen({ mapKey: this.sectionType })
    );
  }

  onMapCenterOnMarker() {
    this._store.dispatch(
      new UIMapActions.RequestRecenter({ mapKey: this.sectionType })
    );
  }

  onMapIsCenterUpdated(isCentered: boolean) {
    this._store.dispatch(
      new UIMapActions.IsCenteredUpdate({
        mapKey: this.sectionType,
        isCentered
      })
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
