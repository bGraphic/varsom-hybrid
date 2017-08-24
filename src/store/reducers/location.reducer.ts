import { ActionReducer, Action } from '@ngrx/store';
import * as LocationActions from '../actions/location.actions';
import { Coords } from '../models/location';

export interface State {
  coords?: Coords;
  updated?: Date;
  zoom: Number
}

export function reducer(state: State, action) {
  switch (action.type) {
    case LocationActions.COORDS_UPDATED:
      console.log('Updating', action);
      return Object.assign({}, { ...state }, { coords: action.payload, updated: new Date() });
  };
}
