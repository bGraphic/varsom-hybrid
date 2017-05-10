
export class AreaUtils {

  static readonly OSLO_MUNICIPALITY_ID = '0301';
  private static readonly OSLO_COUNTY_ID = '03';
  private static readonly MUNICIPALITIES_START_OF_NUMBER_SERIES = 100;
  private static readonly MUNICIPALITIES_END_OF_NUMBER_SERIES = 3000;

  static isOslo(areaId: string): boolean {
    return this.OSLO_COUNTY_ID === areaId || this.OSLO_MUNICIPALITY_ID === areaId;
  }

  static getParentId(areaId): string {
    if (this.isMunicipality(areaId)) {
      return areaId.substr(0, 2);
    }
  }

  static isCounty(areaId: string) {
    let areaIdAsNumber = Number(areaId);
    return this.MUNICIPALITIES_START_OF_NUMBER_SERIES > areaIdAsNumber;
  }

  static isRegion(areaId: string) {
    let areaIdAsNumber = Number(areaId);
    return this.MUNICIPALITIES_END_OF_NUMBER_SERIES <= areaIdAsNumber;
  }

  static isMunicipality(areaId: string) {
    return !this.isRegion(areaId) && !this.isCounty(areaId);
  }

}
