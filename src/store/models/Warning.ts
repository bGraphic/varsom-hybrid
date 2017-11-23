export type WarningType =
  | "Avalanche"
  | "Flood"
  | "Landslide"
  | "FloodLandslide";

export interface Warning {
  regionId: string;
  rating: number;
  date: Date;
  meta: any;
}

export interface RegionWarnings {
  regionId: string;
  warnings: Warning[];
}
