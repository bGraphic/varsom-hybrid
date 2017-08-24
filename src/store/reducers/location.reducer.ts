import * as LocationActions from '../actions/location.actions';

export interface State {
  latitude: number,
  longitude: number,
  timestamp: Date,
  zoom: number
}

const initialState: State = {
  latitude: 64.871,
  longitude: 16.949,
  timestamp: new Date(),
  zoom: 4
}

export function reducer(state = initialState, action) {
  switch (action.type) {
    case LocationActions.POSITION_SUCCESS:
      return Object.assign(
        {},
        { ...state },
        { ...action.payload },
        { zoom: 10 });
  };
}