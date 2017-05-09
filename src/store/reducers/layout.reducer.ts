import * as layout from './../actions/layout.actions';
import * as localStorage from './../actions/local-storage.actions';

export interface State {
  activeRootSection: string;
  rootSections: {
    [id: string]: {
      filter: string;
    }
  }
}

const initialState: State = {
  activeRootSection: 'AVALANCHE',
  rootSections: {
    FLOOD_LANDSLIDE: {
      filter: 'ALL'
    },
    AVALANCHE: {
      filter: 'ALL'
    }
  }
};

export function reducer(state = initialState, action: layout.Actions | localStorage.Actions): State {
  switch (action.type) {
    case layout.OPEN_SECTION:
      return Object.assign({}, state, {
        activeRootSection: action.payload
      });
    case layout.FILTER_SECTION:
      return Object.assign({}, state, {
        rootSections: Object.assign({}, state.rootSections, {
          [action.payload.sectionId]: {
            filter: action.payload.filter
          }
        })
      });
    case localStorage.LOAD_SUCESS:
      return Object.assign({}, state, {
        activeRootSection: action.payload.rootSection
      });
    default:
      return state;
  }
}

export const getActiveSection = (state: State) => state.activeRootSection;
export const getSections = (state: State) => state.rootSections;
