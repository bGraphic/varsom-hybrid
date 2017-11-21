import * as LocationActions from "../actions/location.actions";
import * as UIMapActions from "../actions/ui-map.actions";
import { Position } from "../models/Location";

const DEFAULT_POSITION_ZOOM = 4;
const DEFAULT_POSITION = {
  latitude: 64.871,
  longitude: 16.949
};
const USER_POSITION_ZOOM = 6;

interface MapState {
  center: Position;
  zoom: number;
  fullscreen: boolean;
  centered: boolean;
  recenter: Date;
}

export interface State {
  [key: string]: MapState;
}

const initialMapState: MapState = {
  center: DEFAULT_POSITION,
  zoom: DEFAULT_POSITION_ZOOM,
  fullscreen: false,
  centered: true,
  recenter: null
};

const initialState: State = {
  FloodLandslide: initialMapState,
  Avalanche: initialMapState
};

export function reducer(
  state = initialState,
  action: LocationActions.All | UIMapActions.All
) {
  switch (action.type) {
    case LocationActions.POSITION_UPDATED:
      return Object.keys(state).reduce((prev, key) => {
        prev[key] = Object.assign(
          { ...state[key] },
          {
            center: action.payload,
            zoom: USER_POSITION_ZOOM
          }
        );
        return prev;
      }, {});
    case UIMapActions.REQUEST_RECENTER:
      return Object.keys(state).reduce((prev, key) => {
        prev[key] = Object.assign(
          { ...state[key] },
          {
            recenter:
              key === action.payload.mapKey ? new Date() : state[key].recenter
          }
        );
        return prev;
      }, {});
    case UIMapActions.IS_CENTERED_UPDATE:
      return Object.keys(state).reduce((prev, key) => {
        prev[key] = Object.assign(
          { ...state[key] },
          {
            centered:
              key === action.payload.mapKey
                ? action.payload.isCentered
                : state[key].centered
          }
        );
        return prev;
      }, {});
    case UIMapActions.TOOGLE_FULLSCREEN:
      return Object.keys(state).reduce((prev, key) => {
        prev[key] = Object.assign(
          { ...state[key] },
          {
            fullscreen:
              key === action.payload.mapKey
                ? !state[key].fullscreen
                : state[key].fullscreen
          }
        );
        return prev;
      }, {});
    default:
      return state;
  }
}
