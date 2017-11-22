import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Store } from "@ngrx/store";
import { SectionType } from "../../store/models/Section";
import { MapSettings } from "../../store/models/MapSettings";
import * as fromRoot from "./../../store/reducers";
import * as UIMapActions from "./../../store/actions/ui-map.actions";
import { Observable } from "rxjs/Observable";
import { Position } from "../../store/models/Location";
import { ThemeUtils } from "../../utils/theme-utils";

@Component({
  selector: "overview-map",
  templateUrl: "overview-map.html"
})
export class OverviewMap {
  @Input() sectionType: SectionType;
  @Input() regionId: string;
  @Input() offset: number;
  @Output() onRegionSelect = new EventEmitter();
  settings$: Observable<MapSettings>;
  recenterRequests$: Observable<Date>;
  geojson$: Observable<any[]>;
  marker$: Observable<Position>;

  constructor(private _store: Store<fromRoot.State>) {}

  ngOnInit() {
    const selectedSegment$ = this._store.select(
      fromRoot.getSelectedSegmentForSection(this.sectionType)
    );

    const geojson$ = this._store.select(
      fromRoot.getGeojsonForSection(this.sectionType)
    );

    const forecasts$ = this._store.select(
      fromRoot.getForecastsForSection(this.sectionType, this.regionId)
    );

    this.marker$ = this._store.select(fromRoot.getPosition());

    this.settings$ = this._store.select(
      fromRoot.getMapSettingsForSection(this.sectionType)
    );

    this.recenterRequests$ = this._store.select(
      fromRoot.getMapRecenterRequestsForSection(this.sectionType)
    );

    this.geojson$ = Observable.combineLatest(
      geojson$,
      forecasts$,
      selectedSegment$
    ).map(([geojson, forecasts, selectedSegment]) => {
      return geojson.map(feature => {
        const forecast = forecasts[selectedSegment].find(
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

  onToggleFullscreen($event) {
    this._store.dispatch(
      new UIMapActions.ToogleFullscreen({ mapKey: this.sectionType })
    );
  }

  onIsCenteredUpdate($event) {
    this._store.dispatch(
      new UIMapActions.IsCenteredUpdate({
        mapKey: this.sectionType,
        isCentered: $event
      })
    );
  }

  onReCenter($event) {
    this._store.dispatch(
      new UIMapActions.RequestRecenter({ mapKey: this.sectionType })
    );
  }
}
