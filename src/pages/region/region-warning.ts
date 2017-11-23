import { Component, Input, Output, EventEmitter } from "@angular/core";
import {
  Warning,
  WarningType,
  RegionWarnings
} from "../../store/models/Warning";

@Component({
  selector: "region-warning",
  templateUrl: "region-warning.html"
})
export class RegionWarning {
  @Input() warnings: { [k in WarningType]?: RegionWarnings };
  @Input() warningType: WarningType;
  @Input() warningIndex: number;
  @Output() onSelect = new EventEmitter();
  warning: Warning;

  constructor() {}

  ngOnChanges() {
    if (
      this.warnings &&
      this.warnings[this.warningType] &&
      this.warnings[this.warningType].warnings.length > this.warningIndex
    ) {
      this.warning = this.warnings[this.warningType].warnings[
        this.warningIndex
      ];
    }
  }

  rating(warning) {
    if (warning) {
      return warning.rating;
    }
  }
}
