import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import 'leaflet';
import { Observable } from "rxjs";
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

  @Input() forecastsObs: Observable<Forecast[]>;
  @Input() geojsonObs: Observable<any>;
  @Output() areaSelected: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('map') mapEl: any;

  private _map: L.Map;
  private _geojsonLayer: L.GeoJSON;

  private _geoJsonData: any;
  private _forecasts: Forecast[];
  private _location: {latLng: L.LatLng, zoom: number};

  constructor (private settings: SettingsService, private theme: Theme) {

  }

  ngOnInit(): void {
    this.createMap();
    this.updateGeoJsonData();

    this.subscribeToLocation();
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
          this._forecasts = forecasts;
          this.updateGeoJsonStyle();
        }
      );
  }

  private subscribeToLocation() {
    this.settings.currentPosition
      .subscribe(location => {
        let firstTime = !this._location;
        this._location = location;
        this.updateMapCenter(firstTime);
      });
  }

  private subscribeToGeoJson() {
    this.geojsonObs
      .subscribe( data => {
        this._geoJsonData = data;
        this.updateGeoJsonData();
      });
  }

  private updateMapCenter(first:boolean) {
    if(!this._map && !this._location) {
      return;
    }

    if(first) {
      this._map.setView(this._location.latLng, this._location.zoom);
    } else {
      this._map.flyTo(this._location.latLng, this._location.zoom);
    }
  }

  private updateGeoJsonData() {

    if(!this._map) {
      return;
    }

    if(this._geojsonLayer) {
      this._geojsonLayer.removeFrom(this._map);
    }

    this._geojsonLayer = L.geoJSON(this._geoJsonData, {
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

    if(this._forecasts) {
      let forecast = Forecast.findForecastWithAreaId(this._forecasts, Map.transformGeoJsonToAreaId(feature));
      if(forecast) {
        color = this.theme.colorForRating(forecast.mapWarning.rating);
      }
    }

    let style = {
      color: color
    }

    return style;
  }

  private onEachFeature(feature:any, layer: any) {
    let self = this;
    layer.on("click", function (event) {
      self.areaSelected.emit(Map.transformGeoJsonToAreaId(feature));
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
