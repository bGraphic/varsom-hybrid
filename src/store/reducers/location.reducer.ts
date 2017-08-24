import { ActionReducer, Action } from '@ngrx/store';
import { LocationActions } from '../actions/location.actions';
import { Location } from '../models/location';

export function LocationReducer(state = Location, action) {
  switch (action.type) {
    case LocationActions.COORDS_UPDATED:
      console.log('Updating', action);
      return Object.assign({}, { ...state }, { coords: action.payload, updated: new Date() });
  };
}
