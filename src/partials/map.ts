import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import 'leaflet';
import { Forecast } from '../models/Forecast';
import { ThemeUtils } from "../utils/theme-utils";

@Component({
  selector: 'nve-map',
  template: '<div #map></div>'
})
export class Map {
  private static TILE = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png';
  private static MIN_ZOOM = 4;
  private static MAX_ZOOM = 7;

  @Input() forecasts: Forecast[];
  @Input() geoJsonData: any;
  @Input() center: { latitude: number, longitude: number };
  @Input() marker: { latitude: number, longitude: number };
  @Input() zoomLevel: number;
  @Output() areaSelected: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('map') mapEl: any;

  private _map: L.Map;
  private _geojsonLayer: L.GeoJSON;
  private _marker: L.Marker;

  constructor() {

  }

  ngOnInit(): void {
    this.createMap();
    this.updateMapCenter();
    this.updateMapMarker();
    this.updateGeoJsonData();
  }

  ngOnChanges(changes) {

    if (changes.forecasts) {
      this.updateGeoJsonData();
    }

    if (changes.geoJsonData) {
      this.updateGeoJsonData();
    }

    if (changes.center) {
      this.updateMapCenter();
    }

    if (changes.marker) {
      this.updateMapMarker();
    }
  }

  private createMap() {

    this._map = L.map(this.mapEl.nativeElement, {
      zoomControl: false,
      minZoom: Map.MIN_ZOOM,
      maxZoom: Map.MAX_ZOOM
    });

    L.tileLayer(Map.TILE, {}).addTo(this._map);
  }

  private updateMapCenter() {
    if (!this._map || !this.center) {
      return;
    }

    this._map.setView(new L.LatLng(this.center.latitude, this.center.longitude), this.zoomLevel);
  }

  private updateMapMarker() {
    if (!this._map || !this.marker) {
      return;
    }

    if (!this._marker) {
      this._marker = new L.Marker(new L.LatLng(this.marker.latitude, this.marker.longitude));
      this._marker.addTo(this._map);
    } else {
      this._marker.setLatLng(new L.LatLng(this.marker.latitude, this.marker.longitude));
    }
  }

  private updateGeoJsonData() {

    if (!this._map || !this.geoJsonData) {
      return;
    }

    if (this._geojsonLayer) {
      this._geojsonLayer.removeFrom(this._map);
    }

    this._geojsonLayer = L.geoJSON(this.geoJsonData, {
      style: (feature) => this.featureStyle(feature),
      onEachFeature: (feature, layer) => this.onEachFeature(feature, layer),
      filter: (feature) => this.featureFilter(feature),
    }).addTo(this._map)

  }

  private updateGeoJsonStyle() {
    if (!this._geojsonLayer) {
      return;
    }

    this._geojsonLayer.setStyle((feature) => this.featureStyle(feature));
  }

  private featureStyle(feature: any) {

    let color = ThemeUtils.colorForRating(0);
    let fillOpacity = 0.2;

    if (this.forecasts) {
      let forecast = Forecast.findForecastWithAreaId(this.forecasts, Map.transformGeoJsonToAreaId(feature));
      if (forecast) {
        color = ThemeUtils.colorForRating(forecast.mapWarning.rating);
      }
    }

    if (feature.mousedown) {
      fillOpacity = 0.5;
    }

    let style = {
      color: color,
      fillOpacity: fillOpacity
    }

    return style;
  }

  private featureFilter(feature: any) {

    let forecast = Forecast.findForecastWithAreaId(this.forecasts, feature.properties.omraadeid);

    if (!forecast && 'B' === feature.properties.regiontype) {
      return false;
    }

    if (forecast && forecast.isTypeB() && 0 === forecast.getDay(0).rating) {
      return false;
    }

    return true;
  }

  private onEachFeature(feature: any, layer: any) {
    let self = this;

    layer.on("mousedown", function (event) {
      feature.mousedown = true;
      self.updateGeoJsonStyle();
    });

    layer.on("click", function (event) {
      self.areaSelected.emit(Map.transformGeoJsonToAreaId(feature));
    });

    layer.on("mouseup", function (event) {
      feature.mousedown = false;
      self.updateGeoJsonStyle();
    });
  }

  private static transformGeoJsonToAreaId(geoJsonFeature): string {

    let id: number;

    if (geoJsonFeature.hasOwnProperty('properties')) {
      if (geoJsonFeature.properties.hasOwnProperty('fylkesnr')) {
        id = Number(geoJsonFeature.properties.fylkesnr);
      } else if (geoJsonFeature.properties.hasOwnProperty('omraadeid')) {
        id = Number(geoJsonFeature.properties.omraadeid);
      }
    }

    if (id < 10) {
      return "0" + id;
    } else {
      return "" + id;
    }
  }
}
