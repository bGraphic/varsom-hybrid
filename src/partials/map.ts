import { Component, Input, ViewChild } from '@angular/core';
import 'leaflet';
import { Observable } from "rxjs";
import { Forecast } from '../models/Forecast';
import { SettingsService } from "../services/settings";

@Component({
  selector: 'nve-map',
  template: '<div #map></div>'
})
export class Map {
  private static TILE = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png';
  private static CENTER = L.latLng(64.871, 16.949);
  private static MIN_ZOOM = 4;
  private static MAX_ZOOM = 7;
  private static LOCATION_ZOOM = 6;

  @Input() forecastsObs: Observable<Forecast[]>;
  @Input() geojsonObs: Observable<GeoJSON.GeoJsonObject>;
  @ViewChild('map') mapEl: any;

  geojsonLayer: L.GeoJSON;
  forecasts: Forecast[];

  constructor (private settings: SettingsService) {
    console.log("Map: constructor");

  }

  ngOnInit(): void {
    let map = Map.createMap(this.mapEl.nativeElement, this.settings.currentPosition.getValue());
    this.settings.currentPosition
      .subscribe(location => {
        if(location) {
          map.flyTo(location, Map.LOCATION_ZOOM);
        }
      });
    this.geojsonLayer = L.geoJSON().addTo(map);
  }

  ngOnChanges(changes) {

    if(changes.forecastsObs) {
      this.subscribeToForecasts();
    }

    if(changes.geojsonObs) {
      this.subscribeToGeoJson();
    }
  }

  private subscribeToForecasts() {
    this.forecastsObs
      .subscribe(
        forecasts => {
          this.forecasts = forecasts;
          this.updateGeoJSON();
        }
      );
  }

  private subscribeToGeoJson() {
    this.geojsonObs
      .subscribe( geojson => {
        this.geojsonLayer.addData(geojson);
        this.updateGeoJSON();
      });
  }

  private updateGeoJSON() {
    if(this.geojsonLayer) {
      console.log("Map: set style");
      return this.geojsonLayer.setStyle(geoJsonFeature => Map.geoJsonFeatureStyle(geoJsonFeature, this.forecasts));
    }
  }

  private static geoJsonFeatureStyle(geoJsonFeature:GeoJSON.Feature<GeoJSON.GeometryObject>, forecasts:Forecast[]) {
    let rating = 0;

    let forecast = Forecast.findForecastWithAreaId(forecasts, Map.transformGeoJsonToAreaId(geoJsonFeature));
    if(forecast) {
      rating = forecast.mapWarning.rating;
    }

    let style = {
      color: '#C8C8C8'
    }
    return style;
  }

  private static createMap(el: any, location:L.LatLng): L.Map {

    var map = L.map(el, {
      zoomControl: false,
      minZoom: Map.MIN_ZOOM,
      maxZoom: Map.MAX_ZOOM
    });

    if(location) {
      map.setView(location, Map.LOCATION_ZOOM);
    } else {
      map.setView(Map.CENTER, Map.MIN_ZOOM);
    }

    L.tileLayer(Map.TILE, {}).addTo(map);

    return map;
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
