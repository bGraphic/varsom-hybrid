export interface Coords {
  latitude: Number,
  longitude: Number
}

export interface Location {
  coords: Coords;
  updated: Date;
  zoom: Number
}