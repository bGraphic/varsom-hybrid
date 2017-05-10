import { Injectable } from '@angular/core';

@Injectable()
export class ThemeUtils {

  private static readonly RATING_COLORS = [
    '#C8C8C8',
    '#75B100',
    '#FFCC33',
    '#E46900',
    '#D21523',
    '#3E060B'
  ]

  constructor() {

  }

  static colorForRating(rating: number): string {
    if (rating >= 0 && rating < this.RATING_COLORS.length) {
      return this.RATING_COLORS[rating];
    } else {
      return 'transparent';
    }
  }

}
