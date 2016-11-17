import { Component, Input, ViewChild } from '@angular/core';
import 'leaflet';
import {Observable} from "rxjs";
import { Area } from '../models/Area';
import {Theme} from "../theme/theme";

@Component({
  selector: 'nve-map',
  template: '<div #map></div>'
})
export class Map {
  private static TILE = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png';
  private static CENTER = L.latLng(64.871, 16.949);
  private static MIN_ZOOM = 4;
  private static MAX_ZOOM = 7;

  @Input() forecastTypeObs: Observable<string>;
  @Input() areasObs: Observable<Area[]>;
  @Input() geojsonObs: Observable<GeoJSON.GeoJsonObject>;
  @ViewChild('map') mapEl: any;

  areas: Area[];
  forecastType: string;
  geojsonLayer: L.GeoJSON;

  constructor () {

  }

  ngOnInit(): void {
    let map = Map.createMap(this.mapEl.nativeElement);
    map.locate({setView: true, maxZoom: Map.MIN_ZOOM+2});

    this.geojsonLayer = L.geoJSON().addTo(map);

    this.areasObs.subscribe(areas => {
      this.areas = areas;
    });

    this.subscribeToGeoJson();
    this.subscribeToForecasts();
    this.subscribeToForecastType();
  }

  private subscribeToForecastType() {
    this.forecastTypeObs
      .subscribe(
        forecastType => {
          this.forecastType = forecastType;
          this.updateGeoJSON();
        }
      );
  }

  private subscribeToForecasts() {
    this.areasObs
      .subscribe(
        areas => {
          for (let area of areas) {
            area.getForecast(this.forecastType)
              .subscribe(forecast => {
                this.updateGeoJSON();
              });
          }
        }
      );
  }

  private subscribeToGeoJson() {
    this.geojsonObs
      .subscribe( geojson => {
        this.geojsonLayer.addData(geojson);
      });
  }

  private updateGeoJSON = () => {
    return this.geojsonLayer.setStyle(geoJsonFeature => Map.geoJsonFeatureStyle(geoJsonFeature, this.areas, this.forecastType));
  }

  private static geoJsonFeatureStyle(geoJsonFeature:GeoJSON.Feature<GeoJSON.GeometryObject>, areas:Area[], forecastType: string) {

    if(!areas || !forecastType) {
      return {
        color: Theme.colorForLevel(null)
      }
    }

    let rating: number;
    let areaKey = Area.areaKeyFromGeoJsonFeature(geoJsonFeature);
    let area = Area.findAreaWithAreaKey(areas, areaKey);

    if(area) {
      rating = area.getForecastValue(forecastType).getMapWarning().getLevel();
    }

    let style = {
      color: Theme.colorForLevel(rating)
    }
    return style;
  }

  private static createMap(el: any): L.Map {
    var map = L.map(el, {
      zoomControl: false,
      minZoom: Map.MIN_ZOOM,
      maxZoom: Map.MAX_ZOOM
    }).setView(Map.CENTER, Map.MIN_ZOOM);

    L.tileLayer(Map.TILE, {}).addTo(map);

    return map;
  }
}
