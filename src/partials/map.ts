import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import 'leaflet';
import { Forecast } from '../models/Forecast';
import { SettingsService } from "../services/settings";
import { Theme } from "../providers/theme";

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
  @Input() center: {latLng: L.LatLng, zoom: number};
  @Output() areaSelected: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('map') mapEl: any;

  private _map: L.Map;
  private _geojsonLayer: L.GeoJSON;

  constructor (private settings: SettingsService, private theme: Theme) {

  }

  ngOnInit(): void {
    this.createMap();
    this.updateGeoJsonData();
    this.updateMapCenter();
  }

  ngOnChanges(changes) {

    if(changes.forecasts) {
      this.updateGeoJsonStyle();
    }

    if(changes.geoJsonData) {
      this.updateGeoJsonData();
    }

    if(changes.center){
      this.updateMapCenter();
    }
  }

  private updateMapCenter() {
    if(!this._map) {
      return;
    }

    this._map.setView(this.center.latLng, this.center.zoom);
  }

  private updateGeoJsonData() {

    if(!this._map) {
      return;
    }

    if(this._geojsonLayer) {
      this._geojsonLayer.removeFrom(this._map);
    }

    this._geojsonLayer = L.geoJSON(this.geoJsonData, {
      style: (feature) => this.featureStyle(feature),
      onEachFeature: (feature, layer) => this.onEachFeature(feature, layer)
    }).addTo(this._map)

  }

  private updateGeoJsonStyle() {
    if(!this._geojsonLayer) {
      return;
    }

    this._geojsonLayer.setStyle((feature) => this.featureStyle(feature));
  }

  private featureStyle(feature:any) {

    let color = this.theme.colorForRating(0);
    let fillOpacity = 0.2;

    if(this.forecasts) {
      let forecast = Forecast.findForecastWithAreaId(this.forecasts, Map.transformGeoJsonToAreaId(feature));
      if(forecast) {
        color = this.theme.colorForRating(forecast.mapWarning.rating);
      }
    }

    if(feature.mousedown) {
      fillOpacity = 0.5;
    }

    let style = {
      color: color,
      fillOpacity: fillOpacity
    }

    return style;
  }

  private onEachFeature(feature:any, layer: any) {
    let self = this;
    layer.on("click", function (event) {
      feature.mousedown = false;
      self.updateGeoJsonStyle();
      self.areaSelected.emit(Map.transformGeoJsonToAreaId(feature));
      console.log("click");
    });

    layer.on("mousedown", function (event) {
      console.log("mousedown");
      feature.mousedown = true;
      self.updateGeoJsonStyle();
    });
  }

  private createMap() {

    this._map = L.map(this.mapEl.nativeElement, {
      zoomControl: false,
      minZoom: Map.MIN_ZOOM,
      maxZoom: Map.MAX_ZOOM
    });

    L.tileLayer(Map.TILE, {}).addTo(this._map);
  }

  private static transformGeoJsonToAreaId(geoJsonFeature):string {

    let id: number;

    if(geoJsonFeature.hasOwnProperty('properties')) {
      if(geoJsonFeature.properties.hasOwnProperty('fylkesnr')) {
        id = Number(geoJsonFeature.properties.fylkesnr);
      } else if (geoJsonFeature.properties.hasOwnProperty('omraadeid')){
        id = Number(geoJsonFeature.properties.omraadeid);
      }
    }

    if(id < 10) {
      return "0" + id;
    } else {
      return "" + id;
    }
  }
}
