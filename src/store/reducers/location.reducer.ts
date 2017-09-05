import * as LocationActions from '../actions/location.actions';
import { Position, PositionError } from '../models/Location';

export interface State {
  position: Position,
  zoom: number,
  error?: PositionError
}

const initialState: State = {
  position: {
    latitude: 64.871,
    longitude: 16.949
  },
  zoom: 4
}

export function reducer(state = initialState, action: LocationActions.All) {
  console.log("ACTION", action);
  switch (action.type) {
    case LocationActions.POSITION_SUCCESS:
      return Object.assign(
        { ...state },
        {
          zoom: 6,
          position: action.payload
        });
    case LocationActions.POSITION_ERROR:
      return Object.assign(
        { ...state },
        {
          error: action.payload
        }
      );
    default:
      return state
  };
}