export const OSLO_COUNTY_ID = "03";
export const OSLO_MUNICIPALITY_ID = "0301";

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
}
