import * as LocationActions from '../actions/location.actions';
import * as UIMapActions from '../actions/ui-map.actions';
import { Position, PositionError } from '../models/Location';

interface MapState {
  zoom: number,
  center: Position,
  fullscreen: boolean
}

export interface State {
  [key: string]: MapState
}

const initialMapState: MapState = {
  zoom: 4,
  center: {
    latitude: 64.871,
    longitude: 16.949
  },
  fullscreen: false
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
            zoom: 6,
            center: action.payload
          }
        )
        return prev;
      }, {})
    case UIMapActions.TOOGLE_FULLSCREEN:
      return Object.keys(state).reduce((prev, key) => {
        prev[key] = Object.assign(
          { ...state[key] },
          {
            fullscreen: key === action.payload ? !state[key].fullscreen : state[key].fullscreen
          }
        )
        return prev;
      }, {})
    default:
      return state
  };
}