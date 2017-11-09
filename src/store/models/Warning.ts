export type WarningType = "Avalanche" | "Flood" | "Landslide";

export interface Warning {
  regionId: string;
  rating: number;
  date: Date;
  meta: any;
}
