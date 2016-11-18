import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Forecast } from "./Forecast";
import { Warning } from "./Warning";
export class Area {

  private _item;
  private _parentKey: string;
  private _areaType: string;

  private constructor() {

  }

  get name(): string {
    if(this._item.hasOwnProperty('Name')) {
      return this._item.Name;
    }
  }

  get key(): string {
    if(this._item.hasOwnProperty('Name')) {
      return this._item.$key;
    }
  }

  get parentKey(): string {
    return this._parentKey;
  }

  get areaType():string {
    return this._areaType;
  }

  static areaKeyFromGeoJsonFeature(geoJsonFeature) {
    let id: number;

    if(geoJsonFeature.hasOwnProperty('properties')) {
      if(geoJsonFeature.properties.hasOwnProperty('fylkesnr')) {
        id = Number(geoJsonFeature.properties.fylkesnr);
      } else if (geoJsonFeature.properties.hasOwnProperty('omraadeid')){
        id = Number(geoJsonFeature.properties.omraadeid);
      }
    }

    if(id < 10) {
      return "id0" + id;
    } else {
      return "id" + id;
    }

  }

  static findAreaWithAreaKey(areas:Area[], areaKey: string) {
    for (let area of areas){
      if( area.key == areaKey) {
        return area;
      }
    }
  }

  static createFromFirebaseJson(item: any, areaType:string, parentKey?:string) {
    let area = new Area();
    area._item = item;
    area._areaType = areaType;
    area._parentKey = parentKey;
    return area;
  }
}
