import { Component, Input } from '@angular/core';

@Component({
  selector: 'nve-warning-badge',
  template: '<ion-badge color="level{{level}}">{{level}}</ion-badge>',
})
export class WarningBadge {
  @Input() level: number;

  constructor() {
    console.log("Level ", this.level);
  }
}
