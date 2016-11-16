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

    let map = this.createMap(this.mapEl.nativeElement);
    map.on('locationfound', this.onLocationFound);
    map.locate({setView: true, maxZoom: 6});

    let geojsonLayer = L.geoJSON().addTo(map);

    this.subscribeToGeoJson(geojsonLayer, geojsonObs);
    this.subscribeToAreas(this.areas, geojsonLayer);

  }

  private subscribeToAreas(areas: Observable<Area[]>, geojsonLayer: L.GeoJSON) {
    areas
      .subscribe(
        areas => {
          geojsonLayer.setStyle(geoJsonFeature => this.geoJsonFeatureStyle(geoJsonFeature, areas));
        }
      );
  }

  private subscribeToGeoJson(geojsonLayer: L.GeoJSON, geojsonObs:Observable<GeoJSON.GeoJsonObject> ) {
    geojsonObs
      .subscribe( geojson => {
        geojsonLayer.addData(geojson);
      });
  }

  private geoJsonFeatureStyle(geoJsonFeature:GeoJSON.Feature<GeoJSON.GeometryObject>, areas:Area[]) {

    let rating: number;
    let areaKey = Area.areaKeyFromGeoJsonFeature(geoJsonFeature);
    let area = Area.findAreaWithAreaKey(areas, areaKey);

    if(area) {
      rating = 2;
    }

    let style = {
      color: Theme.colorForLevel(rating)
    }
    return style;
  }

  private createMap(el: any): L.Map {
    const initialCenter = L.latLng(64.871, 16.949);
    var map = L.map(el, {
      zoomControl: false,
      minZoom: 4,
      maxZoom: 7
    }).setView(initialCenter, 4);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {}).addTo(map);

    return map;
  }

  onLocationFound(event) {
//    this.center = event.latlng;
  }
}
