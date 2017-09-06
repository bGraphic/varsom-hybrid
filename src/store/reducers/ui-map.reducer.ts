import * as LocationActions from '../actions/location.actions';
import * as UIMapActions from '../actions/ui-map.actions';
import { Position, PositionError } from '../models/Location';

const ZOOM_DEFAULT = 6;

interface MapState {
  marker: Position,
  center: Position,
  zoom: number,
  fullscreen: boolean,
  moved: boolean
}

export interface State {
  [key: string]: MapState
}

const initialMapState: MapState = {
  marker: null,
  center: {
    latitude: 64.871,
    longitude: 16.949
  },
  zoom: 4,
  fullscreen: false,
  moved: false
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
            marker: action.payload,
            // If map is moved let zoom/center/moved be whatever it is
            center: state[key].moved ? state[key].center : action.payload,
            zoom: state[key].moved ? state[key].zoom : ZOOM_DEFAULT,
            moved: state[key].moved ? state[key].moved : false,
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
    case UIMapActions.CENTER_ON_MARKER:
      return Object.keys(state).reduce((prev, key) => {
        const markerCenter = state[key].marker ? state[key].marker : initialMapState.center;
        const markerZoom = state[key].marker ? ZOOM_DEFAULT : initialMapState.zoom;

        prev[key] = Object.assign(
          { ...state[key] },
          {
            center: key === action.payload.mapKey && state[key].moved ? markerCenter : state[key].center,
            moved: key === action.payload.mapKey && state[key].moved ? false : state[key].moved,
            zoom: key === action.payload.mapKey && state[key].moved ? markerZoom : state[key].zoom
          }
        )
        return prev;
      }, {})
    case UIMapActions.CENTER_UPDATED:
      return Object.keys(state).reduce((prev, key) => {
        prev[key] = Object.assign(
          { ...state[key] },
          {
            // If first move after setting center, remove center. Else turn on moved.
            center: key === action.payload.mapKey && state[key].center ? null : state[key].center,
            moved: key === action.payload.mapKey && !state[key].center ? true : state[key].moved,
          }
        )
        return prev;
      }, {})
    case UIMapActions.ZOOM_UPDATED:
      return Object.keys(state).reduce((prev, key) => {
        prev[key] = Object.assign(
          { ...state[key] },
          {
            zoom: key === action.payload.mapKey ? action.payload.zoom : state[key].zoom,
          }
        )
        return prev;
      }, {})
    default:
      return state
  };
}