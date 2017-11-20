import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Forecast } from "../../store/models/Forecast";
import { Warning } from "../../store/models/Warning";

@Component({
  selector: "overview-list-section",
  templateUrl: "overview-list-section.html"
})
export class OverviewListSection {
  @Input() forecasts: Forecast[];
  @Input() header: string;
  @Output() onSelect = new EventEmitter();

  constructor() {}

  ratings(warnings: Warning[]): number[] {
    return [0, 1, 2].map(day => {
      if (warnings[day]) {
        return warnings[day].rating;
      } else {
        return -1;
      }
    });
  }
}
