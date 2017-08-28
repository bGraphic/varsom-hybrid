import * as LocationActions from '../actions/location.actions';
import { Position, PositionError } from '../models/Location';

interface MapState {
  zoom: number,
  center: Position
}

export interface State {
  [key: string]: MapState
}

const initialMapState: MapState = {
  zoom: 4,
  center: {
    latitude: 64.871,
    longitude: 16.949
  }
}

const initialState: State = {
  FLOOD_LANDSLIDE: initialMapState,
  AVALANCHE: initialMapState
}

export function reducer(state = initialState, action: LocationActions.All) {
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
    default:
      return state
  };
}