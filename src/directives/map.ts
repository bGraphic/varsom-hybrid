import {
  Directive,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef
} from "@angular/core";
import "leaflet";
import { Forecast } from "../store/models/Forecast";
import { ThemeUtils } from "../utils/theme-utils";
import { RegionImportance } from "../store/models/Region";

const TILE = "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png";
const MIN_ZOOM = 4;
const MAX_ZOOM = 7;

@Directive({ selector: "[nveMap]" })
export class MapDirective {
  @Input() forecasts: Forecast[];
  @Input() geoJsonData: any;
  @Input() center: { latitude: number; longitude: number };
  @Input() marker: { latitude: number; longitude: number };
  @Input() zoomLevel: number;
  @Input() recenter: boolean;
  @Output()
  isCenteredUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() areaSelected: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild("map") mapEl: any;

  private _map: L.Map;
  private _geojsonLayer: L.GeoJSON;
  private _marker: L.CircleMarker;
  private _centering: boolean = false;
  private _centered: boolean = true;

  constructor(private _el: ElementRef) {}

  ngAfterViewInit(): void {
    this.createMap();
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

    if (changes.marker) {
      this.updateMapMarker();
    }

    if (changes.center && this._centered) {
      this.updateMapCenter();
    }

    if (changes.recenter && changes.recenter.currentValue) {
      this.updateMapCenter();
    }
  }

  private createMap() {
    this._map = L.map(this._el.nativeElement, {
      zoomControl: false,
      center: [this.center.latitude, this.center.longitude],
      zoom: this.zoomLevel,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM
    });

    this.isCenteredUpdated.emit(this._centered);

    this._map.on("movestart", event => {
      this._centered = this._centering;
      this.isCenteredUpdated.emit(this._centered);
    });

    this._map.on("moveend", event => {
      this._centered = this._centering;
      this.isCenteredUpdated.emit(this._centered);
      this._centering = false;
    });

    L.tileLayer(TILE, {}).addTo(this._map);
  }

  private updateMapCenter() {
    if (!this._map || !this.center) {
      return;
    }
    this._map.stop();
    this._centering = true;
    this._map.setView(
      new L.LatLng(this.center.latitude, this.center.longitude),
      this.zoomLevel
    );
  }

  private updateMapMarker() {
    if (!this._map || !this.marker) {
      return;
    }

    if (!this._marker) {
      this._marker = new L.CircleMarker(
        new L.LatLng(this.marker.latitude, this.marker.longitude),
        {
          radius: 5,
          weight: 0,
          fill: true,
          fillOpacity: 1,
          interactive: false,
          pane: "markerPane"
        }
      );
      this._marker.addTo(this._map);
    } else {
      this._marker.setLatLng(
        new L.LatLng(this.marker.latitude, this.marker.longitude)
      );
    }
  }

  private updateGeoJsonData() {
    console.log(this.geoJsonData);
    if (!this._map || !this.geoJsonData) {
      return;
    }

    if (this._geojsonLayer) {
      this._geojsonLayer.removeFrom(this._map);
    }

    this._geojsonLayer = L.geoJSON(this.geoJsonData, {
      style: feature => this.featureStyle(feature),
      onEachFeature: (feature, layer) => this.onEachFeature(feature, layer),
      filter: feature => this.featureFilter(feature)
    }).addTo(this._map);
  }

  private updateGeoJsonStyle() {
    if (!this._geojsonLayer) {
      return;
    }

    this._geojsonLayer.setStyle(feature => this.featureStyle(feature));
  }

  private featureStyle(feature: any) {
    const forecast = findFeatureForecast(this.forecasts, feature);

    let color = forecast
      ? ThemeUtils.colorForRating(forecast.highestRating)
      : ThemeUtils.colorForRating(0);
    let fillOpacity = feature.mousedown ? 0.5 : 0.2;

    if (feature.mousedown) {
      fillOpacity = 0.5;
    }

    let style = {
      color: color,
      fillOpacity: fillOpacity
    };

    return style;
  }

  private featureFilter(feature: any) {
    const forecast = findFeatureForecast(this.forecasts, feature);
    const isBRegion = forecast
      ? forecast.regionImportance === RegionImportance.B
      : featureToRegionImportance(feature) === RegionImportance.B;

    const isActive = forecast ? forecast.highestRating > 1 : false;

    if (isBRegion && !isActive) {
      return false;
    } else {
      return true;
    }
  }

  private onEachFeature(feature: any, layer: any) {
    let self = this;

    layer.on("mousedown", function(event) {
      feature.mousedown = true;
      self.updateGeoJsonStyle();
    });

    layer.on("click", function(event) {
      self.areaSelected.emit(featureToRegionId(feature));
    });

    layer.on("mouseup", function(event) {
      feature.mousedown = false;
      self.updateGeoJsonStyle();
    });
  }
}

const featureToRegionImportance = (feature): RegionImportance => {
  if (feature.hasOwnProperty("properties")) {
    if (feature.properties.hasOwnProperty("regiontype")) {
      return feature.properties.regiontype === "B"
        ? RegionImportance.B
        : RegionImportance.A;
    }
  }
};

const featureToRegionId = (feature): string => {
  let id: number;

  if (feature.hasOwnProperty("properties")) {
    if (feature.properties.hasOwnProperty("fylkesnr")) {
      id = Number(feature.properties.fylkesnr);
    } else if (feature.properties.hasOwnProperty("omraadeid")) {
      id = Number(feature.properties.omraadeid);
    }
  }

  if (id < 10) {
    return "0" + id;
  } else {
    return "" + id;
  }
};

const findFeatureForecast = (forecasts: Forecast[], feature: any): Forecast => {
  const featureRegionId = featureToRegionId(feature);
  return forecasts.find(forecast => forecast.regionId === featureRegionId);
};
