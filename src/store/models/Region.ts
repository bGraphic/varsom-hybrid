export type RegionType = "AvalancheRegion" | "County" | "Municipality";

export enum RegionSubType {
  A = 10,
  B = 20
}

export interface Region {
  name: string;
  id: string;
  type: RegionType;
  subType: RegionSubType | null;
  children?: Region[];
}

export interface Warning {
  rating: number;
  date: Date;
  meta: any;
}
