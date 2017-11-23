import { Component, Input, Output, EventEmitter } from "@angular/core";
import { WarningType } from "../../store/models/Warning";

@Component({
  selector: "overview-segments",
  templateUrl: "overview-segments.html"
})
export class OverviewSegments {
  @Input() segments: WarningType[];
  @Input() selectedSegment: WarningType;
  @Output() onSelect = new EventEmitter();

  constructor() {}
}
