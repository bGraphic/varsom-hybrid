import { Warning } from "./Warning";
import { RegionImportance, RegionType } from "./Region";

export interface Forecast {
  regionId: string;
  regionName: string;
  regionType: RegionType;
  regionImportance: RegionImportance;
  highestRating: number;
  warnings: Warning[];
  sortIndex?: string;
}
