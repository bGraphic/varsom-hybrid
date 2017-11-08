export type ForecastType = "Avalanche" | "Flood" | "Landslide";
export type RegionType = "AvalancheRegion" | "County" | "Municipality";

export enum RegionSubType {
  A = 10,
  B = 20
}

export interface Forecast {
  forecastType: ForecastType;
  regionName: string;
  regionId: string;
  regionType: RegionType;
  regionSubType: RegionSubType | null;
  warnings: Warning[];
}

export interface Warning {
  rating: number;
  date: Date;
  meta: any;
}
