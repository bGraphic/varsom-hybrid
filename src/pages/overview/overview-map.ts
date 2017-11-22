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
  forecasts$: Observable<any[]>;
  marker$: Observable<Position>;

  constructor(private _store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.forecasts$ = this._store.select(fromRoot.getOverviewMapForecasts());

    this.marker$ = this._store.select(fromRoot.getPosition());

    this.settings$ = this._store
      .select(fromRoot.getMapSettings)
      .do(settings => console.log(settings));

    this.recenterRequests$ = this._store.select(
      fromRoot.getMapRecenterRequests
    );
  }

  onToggleFullscreen($event) {
    this._store.dispatch(new UIMapActions.ToogleFullscreen());
  }

  onIsCenteredUpdate($event) {
    this._store.dispatch(
      new UIMapActions.IsCenteredUpdate({
        isCentered: $event
      })
    );
  }

  onReCenter($event) {
    this._store.dispatch(new UIMapActions.RequestRecenter());
  }
}
