export class Warning {

  constructor(private level: number, meta: any) { }

  getLevel(): number {
    return this.level;
  }
}
