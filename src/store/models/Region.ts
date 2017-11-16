export type RegionType = "AvalancheRegion" | "County" | "Municipality";

export enum RegionSubType {
  A = 10,
  B = 20
}

export interface Region {
  name: string;
  id: string;
  type: RegionType;
  subType?: RegionSubType;
  children?: Region[];
}
