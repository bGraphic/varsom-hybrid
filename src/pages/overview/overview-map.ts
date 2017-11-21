import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Forecast } from "../../store/models/Forecast";
import { RegionType, RegionImportance } from "../../store/models/Region";
import { SectionType } from "../../store/models/Section";

@Component({
  selector: "overview-map",
  templateUrl: "overview-map.html"
})
export class OverviewMap {
  @Input() forecasts: Forecast[];
  @Input() geojson: any;
  @Input() marker: any;
  @Input()
  settings: {
    zoomLevel: number;
    center: any;
    isFullscreen: boolean;
    isCentered: boolean;
  };
  @Input() offset: number;
  @Input() recenter: any;
  @Output() onRegionSelect = new EventEmitter();
  @Output() onToggleFullscreen = new EventEmitter();
  @Output() onIsCenterUpdated = new EventEmitter();
  @Output() onCenterOnMarker = new EventEmitter();

  constructor() {}
}
