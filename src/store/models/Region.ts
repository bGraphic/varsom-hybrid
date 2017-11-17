export type RegionType = "AvalancheRegion" | "County" | "Municipality";

export enum RegionImportance {
  A = 10,
  B = 20
}

export interface Region {
  name: string;
  id: string;
  type: RegionType;
  importance?: RegionImportance;
  children?: Region[];
}
