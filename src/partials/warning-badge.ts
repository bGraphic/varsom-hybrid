import { Component, Input } from "@angular/core";

@Component({
  selector: "nve-warning-badge",
  template:
    '<ion-badge color="level{{ level ? level : 0 }}"><span [class.transparent]="level < 0">{{ level === 0 ? "?" : level }}</span></ion-badge>',
  styles: [
    `.transparent {
      opacity: 0
    }`
  ]
})
export class WarningBadge {
  @Input() level: number;
}
