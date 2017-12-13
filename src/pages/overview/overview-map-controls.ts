import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "overview-map-controls",
  templateUrl: "overview-map-controls.html"
})
export class OverviewMapControls {
  @Input()
  settings: {
    isFullscreen: boolean;
    isCentered: boolean;
  };
  @Output() onReCenter = new EventEmitter();
  @Output() onToggleFullscreen = new EventEmitter();

  constructor() {}
}
