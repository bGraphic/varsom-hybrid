import { RegionImportance } from "./Region";

export type ForecastType = "Avalanche" | "Flood" | "Landslide" | "Combined";

export interface Warning {
  regionId: string;
  rating: number;
  date: Date;
  meta: any;
}

export interface Forecast {
  regionId: string;
  regionName?: string;
  regionImportance?: RegionImportance;
  warnings?: [Warning, Warning, Warning];
}
