import { Injectable } from '@angular/core';

@Injectable()
export class Theme {

  private readonly _ratingColors = [
    '#C8C8C8',
    '#75B100',
    '#FFCC33',
    '#E46900',
    '#D21523',
    '#3E060B'
  ]

  constructor() {

  }

  colorForRating(rating:number):string {
    if(rating >= 0 && rating < this._ratingColors.length) {
      return this._ratingColors[rating];
    } else {
      return 'transparent';
    }
  }

}
