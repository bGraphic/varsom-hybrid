export type WarningType = "Avalanche" | "Flood" | "Landslide" | "Combined";

export interface Warning {
  regionId: string;
  rating: number;
  date: Date;
  meta: any;
}

export interface Warnings {
  [regionId: string]: { [k in WarningType]?: Warning[] };
}

export interface Forecasts {
  [regionId: string]: { [k in WarningType]?: number[] };
}
