export interface Forecast {
  type: string;
  regionId: number;
  warnings: Warning[];
}

export interface Warning {
  rating: number;
  date: Date;
  meta: any;
}
