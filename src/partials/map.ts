import { Component, Input, ViewChild } from '@angular/core';
import 'leaflet';
import { GeojsonService }       from '../services/geojson';
import GeoJSON = L.GeoJSON;
import GeoJsonObject = GeoJSON.GeoJsonObject;

@Component({
  selector: 'nve-map',
  template: '<div #map></div>',
  providers: [ GeojsonService ],
})
export class Map {
  @Input() forecastType: string;
  @ViewChild('map') mapEl: any;
  map: L.Map;

  constructor (private geojsonService: GeojsonService) {

  }

  ngOnInit(): void {
    let geojsonName = 'counties';
    if('avalanche' == this.forecastType) {
      geojsonName = 'regions';
    }
    this.map = this.createMap(this.mapEl.nativeElement);
    this.map.locate({setView: true, maxZoom: 6});
    this.getGeojson(geojsonName, this.map, this.addGeoJsonToMap);
  }

  createMap(el: any): L.Map {
    console.log(el);
    var map = L.map(el, {
      zoomControl: false,
      minZoom: 4,
      maxZoom: 7
    }).setView([64.871, 16.949], 4);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {}).addTo(map);

    return map;
  }

  getGeojson(areaType: string, map:L.Map, func: (geojsonArray:GeoJsonObject[], map:L.Map) => void) {
    this.geojsonService.getAreas(areaType)
      .subscribe(
        geojson => func(geojson, map)
      );
  }

  addGeoJsonToMap(geojsonArray:GeoJsonObject[], map:L.Map) {
    for (let geoJson of geojsonArray) {
      var geojsonLayer = L.geoJSON(geoJson).addTo(map);
      geojsonLayer.addData(geoJson);
    }
  }




}
