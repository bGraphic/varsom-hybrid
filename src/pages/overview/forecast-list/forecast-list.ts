import { Component, Input, Output } from "@angular/core";
import { Forecast } from "../../../store/models/Warning";
import { EventEmitter } from "events";
import { Warning } from "../../../models/Warning";

@Component({
  selector: "forecast-list",
  templateUrl: "forecast-list.html"
})
export class ForecastList {
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
