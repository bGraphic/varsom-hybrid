import { Component, Input, ViewChild } from '@angular/core';
import 'leaflet';
import { GeojsonService }       from '../services/geojson';

@Component({
  selector: 'nve-map',
  template: '<div #map></div>',
  providers: [ GeojsonService ],
})
export class Map {
  @Input() forecastType: string;
  @ViewChild('map') mapEl: any;
  map: L.Map;
  center: L.LatLng = L.latLng(64.871, 16.949);

  constructor (private geojsonService: GeojsonService) {

  }

  ngOnInit(): void {
    let geojsonName = 'counties';
    if('avalanche' == this.forecastType) {
      geojsonName = 'regions';
    }
    this.map = this.createMap(this.mapEl.nativeElement, this.center);
    this.map.on('locationfound', this.onLocationFound);

    this.map.locate({setView: true, maxZoom: 6});
    this.getGeojson(geojsonName, this.map, this.addGeoJsonToMap);
  }

  createMap(el: any, center:L.LatLng): L.Map {
    var map = L.map(el, {
      zoomControl: false,
      minZoom: 4,
      maxZoom: 7
    }).setView(center, 4);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {}).addTo(map);

    return map;
  }

  getGeojson(areaType: string, map:L.Map, func: (geojsonArray:L.GeoJSON[], map:L.Map) => void) {
    this.geojsonService.getAreas(areaType)
      .subscribe(
        geojson => func(geojson, map)
      );
  }

  addGeoJsonToMap(geojson:any, map:L.Map) {
    L.geoJSON(geojson).addTo(map);
  }

  onLocationFound(event) {
    this.center = event.latlng;
  }
}
