import * as LocationActions from "../actions/location.actions";
import { Position, PositionError } from "../models/Location";

export interface State {
  position: Position;
  error?: PositionError;
}

const initialState: State = {
  position: null
};

export function reducer(state = initialState, action: LocationActions.All) {
  switch (action.type) {
    case LocationActions.POSITION_UPDATED:
      return Object.assign(
        { ...state },
        {
          position: action.payload
        }
      );
    case LocationActions.POSITION_ERROR:
      return Object.assign(
        { ...state },
        {
          error: action.payload
        }
      );
    default:
      return state;
  }
}
