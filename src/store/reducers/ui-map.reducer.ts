import * as LocationActions from '../actions/location.actions';
import * as UIMapActions from '../actions/ui-map.actions';
import { Position, PositionError } from '../models/Location';

const ZOOM_DEFAULT = 6;

interface MapState {
  marker: Position,
  center: Position,
  zoom: number,
  fullscreen: boolean,
  status: string
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
  status: 'INIT'
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
            center: action.payload,
            zoom: state[key].status === 'INIT' ? state[key].zoom : ZOOM_DEFAULT,
            status: state[key].status === 'CENTERED' ? 'RECENTER' : state[key].status
          }
        )
        return prev;
      }, {})
    case UIMapActions.RECENTER:
      return Object.keys(state).reduce((prev, key) => {
        prev[key] = Object.assign(
          { ...state[key] },
          {
            status: key === action.payload.mapKey && state[key].status !== 'CENTERED' ? 'RECENTER' : state[key].status
          }
        )
        return prev;
      }, {})
    case UIMapActions.MOVED:
      return Object.keys(state).reduce((prev, key) => {
        prev[key] = Object.assign(
          { ...state[key] },
          {
            status: key === action.payload.mapKey && state[key].status === 'RECENTER' ? 'CENTERED' : 'OFF_CENTER',
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
  };
}