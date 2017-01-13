import { Component, Input } from '@angular/core';

@Component({
  selector: 'nve-warning-badge',
  template: '<ion-badge color="level{{ level ? level : 0 }}"><span>{{ level === 0 ? "?" : level }}</span><ion-spinner *ngIf="level === undefined"></ion-spinner></ion-badge>',
})
export class WarningBadge {
  @Input() level: number;
}
