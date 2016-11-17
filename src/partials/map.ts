import { Component, Input, ViewChild } from '@angular/core';
import 'leaflet';
import { GeojsonService }       from '../services/geojson';
import {Observable} from "rxjs";
import { Area } from '../models/Area';
import {Theme} from "../theme/theme";

@Component({
  selector: 'nve-map',
  template: '<div #map></div>',
  providers: [ GeojsonService ],
})
export class Map {
  private static TILE = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png';
  private static CENTER = L.latLng(64.871, 16.949);
  private static MIN_ZOOM = 4;
  private static MAX_ZOOM = 7;


  @Input() forecastType: string;
  @Input() areas: Observable<Area[]>;
  @ViewChild('map') mapEl: any;

  constructor (private geojsonService: GeojsonService) {
    console.log("const");
  }

  ngOnInit(): void {
    console.log("init");
    let geojsonName = 'counties';
    if('avalanche' == this.forecastType) {
      geojsonName = 'regions';
    }

    let geojsonObs = this.geojsonService.getAreas(geojsonName);

    let map = Map.createMap(this.mapEl.nativeElement);
    map.locate({setView: true, maxZoom: Map.MIN_ZOOM+2});

    let geojsonLayer = L.geoJSON().addTo(map);

    Map.subscribeToGeoJson(geojsonLayer, geojsonObs);
    Map.subscribeToAreas(this.areas,  this.forecastType, geojsonLayer);
  }

  private static subscribeToAreas(areas: Observable<Area[]>, forecastType: string, geojsonLayer: L.GeoJSON) {
    areas
      .subscribe(
        areas => {
          for (let area of areas) {
            area.getForecast(forecastType)
              .subscribe(forecast => {
                console.log('style');
                geojsonLayer.setStyle(geoJsonFeature => Map.geoJsonFeatureStyle(geoJsonFeature, areas, forecastType));
              });
          }
        }
      );
  }

  private static subscribeToGeoJson(geojsonLayer: L.GeoJSON, geojsonObs:Observable<GeoJSON.GeoJsonObject> ) {
    geojsonObs
      .subscribe( geojson => {
        geojsonLayer.addData(geojson);
      });
  }

  private static geoJsonFeatureStyle(geoJsonFeature:GeoJSON.Feature<GeoJSON.GeometryObject>, areas:Area[], forecastType: string) {

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
