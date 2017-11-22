import {
  Directive,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef
} from "@angular/core";
import "leaflet";

const TILE = "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png";
const MIN_ZOOM = 4;
const MAX_ZOOM = 7;

@Directive({ selector: "[nveMap]" })
export class MapDirective {
  @Input() geoJsonData: any;
  @Input() center: { latitude: number; longitude: number };
  @Input() marker: { latitude: number; longitude: number };
  @Input() zoomLevel: number;
  @Input() recenterRequest: Date;
  @Output() onIsCenteredUpdate = new EventEmitter<boolean>();
  @Output() onRegionSelect = new EventEmitter<string>();
  @ViewChild("map") mapEl: any;

  private _map: L.Map;
  private _geojsonLayer: L.GeoJSON;
  private _marker: L.CircleMarker;
  private _centering: boolean = true;
  private _centered: boolean = true;

  constructor(private _el: ElementRef) {}

  ngAfterViewInit(): void {
    this.createMap();
    this.updateMapMarker();
    this.updateGeoJsonData();
  }

  ngOnChanges(changes) {
    if (changes.geoJsonData) {
      this.updateGeoJsonData();
    }

    if (changes.marker) {
      this.updateMapMarker();
    }

    if (changes.center && this._centered) {
      if (changes.center.currentValue !== changes.center.previousValue) {
        console.log("update map center", this.center);
        this.updateMapCenter();
      }
    }

    if (changes.recenterRequest && changes.recenterRequest.currentValue) {
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

    this._map.on("movestart", event => {
      console.log(event);
      console.log("Movestart", this._centering);
      this._centered = this._centering;
      this.onIsCenteredUpdate.emit(this._centered);
    });

    this._map.on("moveend", event => {
      console.log("Moveend", this._centering);
      this._centered = this._centering;
      this.onIsCenteredUpdate.emit(this._centered);
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
    if (!this._map || !this.geoJsonData) {
      return;
    }

    if (this._geojsonLayer) {
      this._geojsonLayer.removeFrom(this._map);
    }

    this._geojsonLayer = L.geoJSON(this.geoJsonData, {
      style: feature => this.featureStyle(feature),
      onEachFeature: (feature, layer) => this.onEachFeature(feature, layer)
    }).addTo(this._map);
  }

  private updateGeoJsonStyle() {
    if (!this._geojsonLayer) {
      return;
    }

    this._geojsonLayer.setStyle(feature => this.featureStyle(feature));
  }

  private featureStyle(feature: any) {
    return {
      color: feature.properties.color,
      fillOpacity: feature.mousedown ? 0.5 : 0.2
    };
  }

  private onEachFeature(feature: any, layer: any) {
    let self = this;

    layer.on("mousedown", function(event) {
      feature.mousedown = true;
      self.updateGeoJsonStyle();
    });

    layer.on("click", function(event) {
      self.onRegionSelect.emit(feature.properties.regionId);
    });

    layer.on("mouseup", function(event) {
      feature.mousedown = false;
      self.updateGeoJsonStyle();
    });
  }
}
