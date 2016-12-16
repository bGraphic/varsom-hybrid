export class Warning {

  private _rating: number;
  private _meta: any;
  private _date: Date;

  private constructor() { }

  get rating(): number {
    return this._rating;
  }

  get date(): Date {
    return this._date;
  }

  static createFromFirebaseItem(item: any):Warning {
    let warning = new Warning();
    warning._rating = Number(item.Rating);
    warning._meta = item;
    warning._date = new Date(item.ValidFrom);
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
