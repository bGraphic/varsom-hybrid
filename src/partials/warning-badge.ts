import { Component, Input } from '@angular/core';

@Component({
  selector: 'nve-warning-badge',
  template: '<ion-badge item-left color="level{{level}}" class="nve-warning-badge">{{level}}</ion-badge>',
})
export class WarningBadge {
  @Input() level: number;

  constructor() {
    console.log("Level ", this.level);
  }
}
