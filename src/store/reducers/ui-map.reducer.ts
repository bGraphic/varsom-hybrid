import * as LocationActions from "../actions/location.actions";
import * as UIMapActions from "../actions/ui-map.actions";
import { Position } from "../models/Location";

const DEFAULT_POSITION_ZOOM = 4;
const DEFAULT_POSITION = {
  latitude: 64.871,
  longitude: 16.949
};
const USER_POSITION_ZOOM = 6;

export interface State {
  center: Position;
  zoomLevel: number;
  isFullscreen: boolean;
  isCentered: boolean;
  recenter: Date;
}

const initialState: State = {
  center: DEFAULT_POSITION,
  zoomLevel: DEFAULT_POSITION_ZOOM,
  isFullscreen: false,
  isCentered: true,
  recenter: null
};

export function reducer(
  state = initialState,
  action: LocationActions.All | UIMapActions.All
) {
  switch (action.type) {
    case LocationActions.POSITION_UPDATED:
      return {
        ...state,
        center: action.payload,
        zoom: USER_POSITION_ZOOM
      };
    case UIMapActions.REQUEST_RECENTER:
      return {
        ...state,
        recenter: new Date()
      };
    case UIMapActions.IS_CENTERED_UPDATE:
      return {
        ...state,
        isCentered: action.payload.isCentered
      };
    case UIMapActions.TOOGLE_FULLSCREEN:
      return {
        ...state,
        isFullscreen: !state.isFullscreen
      };
    default:
      return state;
  }
}

export const getSettings = (state: State) => {
  let settings = { ...state };
  delete settings.recenter;
  return settings;
};

export const getRecenterRequests = (state: State) => {
  return state.recenter;
};
