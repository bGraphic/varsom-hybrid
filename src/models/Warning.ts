export class Warning {
  Rating: number;
  constructor( ) { }

  getLevel(): number {
    return this.Rating;
  }
}
