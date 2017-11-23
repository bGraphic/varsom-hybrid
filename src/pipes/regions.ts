import { Pipe, PipeTransform } from "@angular/core";
import { RegionType, Region, RegionImportance } from "../store/models/Region";

@Pipe({ name: "regionsOfType" })
export class RegionsOfTypePipe implements PipeTransform {
  transform(
    regions: { [k in RegionType]?: Region[] },
    regionType?: RegionType
  ): Region[] {
    return regions[regionType] || [];
  }
}

@Pipe({ name: "regionsWithImportance" })
export class RegionsWithImportancePipe implements PipeTransform {
  transform(regions: Region[], regionImportance: RegionImportance) {
    if (regionImportance) {
      return regions.filter(region => {
        return region.importance === regionImportance;
      });
    } else {
      return regions;
    }
  }
}
