export class Warning {

  private _rating: number;
  private _meta: any;

  private constructor() { }

  get rating(): number {
    return this._rating;
  }

  static createFromFirebaseItem(item: any):Warning {
    let warning = new Warning();
    warning._rating = Number(item.Rating);
    warning._meta = item;
    return warning;
  }

  static createEmptyWarning():Warning {
    let warning = new Warning();
    warning._meta = {};
    return warning;
  }

  static getHighest(warningA: Warning, warningB: Warning): Warning {
    if (warningA.rating > warningB.rating) {
      return warningA;
    } else {
      return warningB;
    }
  }
}
