import * as LocationActions from '../actions/location.actions';

export interface State {
  position: {
    latitude: number,
    longitude: number
  },
  timestamp: Date,
  zoom: number,
  error?: {
    code: number,
    message: string
  }
}

const initialState: State = {
  position: {
    latitude: 64.871,
    longitude: 16.949,
  },
  timestamp: new Date(),
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
          timezone: new Date(),
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