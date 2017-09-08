import * as LocationActions from '../actions/location.actions';
import * as UIMapActions from '../actions/ui-map.actions';
import { Position, PositionError } from '../models/Location';

const ZOOM_DEFAULT = 6;

interface MapState {
  init: Position,
  center: Position,
  zoom: number,
  fullscreen: boolean,
  centered: boolean
  recenter: Date
}

export interface State {
  [key: string]: MapState
}

const initialMapState: MapState = {
  init: {
    latitude: 64.871,
    longitude: 16.949
  },
  center: null,
  zoom: 4,
  fullscreen: false,
  centered: true,
  recenter: null
}

const initialState: State = {
  FLOOD_LANDSLIDE: initialMapState,
  AVALANCHE: initialMapState
}

export function reducer(state = initialState, action: LocationActions.All | UIMapActions.All) {
  switch (action.type) {
    case LocationActions.POSITION_SUCCESS:
      return Object.keys(state).reduce((prev, key) => {
        prev[key] = Object.assign(
          { ...state[key] },
          {
            center: action.payload,
            zoom: state[key].center === initialMapState.center ? state[key].zoom : ZOOM_DEFAULT
          }
        )
        return prev;
      }, {})
    case UIMapActions.REQUEST_RECENTER:
      return Object.keys(state).reduce((prev, key) => {
        prev[key] = Object.assign(
          { ...state[key] },
          {
            recenter: key === action.payload.mapKey ? new Date() : state[key].recenter
          }
        )
        return prev;
      }, {})
    case UIMapActions.IS_CENTERED_UPDATE:
      return Object.keys(state).reduce((prev, key) => {
        prev[key] = Object.assign(
          { ...state[key] },
          {
            centered: key === action.payload.mapKey ? action.payload.isCentered : state[key].centered
          }
        )
        return prev;
      }, {})
    case UIMapActions.TOOGLE_FULLSCREEN:
      return Object.keys(state).reduce((prev, key) => {
        prev[key] = Object.assign(
          { ...state[key] },
          {
            fullscreen: key === action.payload.mapKey ? !state[key].fullscreen : state[key].fullscreen
          }
        )
        return prev;
      }, {})
    default:
      return state
  };
}