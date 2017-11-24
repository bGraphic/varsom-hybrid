import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Warning, WarningType } from "../../store/models/Warning";

@Component({
  selector: "warning-details",
  templateUrl: "warning-details.html"
})
export class WarningDetails {
  @Input() warning: Warning;
  @Input() warningType: WarningType;

  constructor() {}
}
