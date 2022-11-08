/* eslint-disable prettier/prettier */
import { STORE_REFERENCES, TOGGLE_REFS_VIEW, FETCHING_REFS } from '../Actions/types';

const initialState = {
  references: [],
  showRefs: false,
  fetching: false,
  fetched: false
};

const referencesReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_REFERENCES:
      return {
        ...state,
        references: action.payload,
        fetched: true,
        fetching: false
      };
    case FETCHING_REFS:
      return {
        ...state,
        fetching: true
      }
    case TOGGLE_REFS_VIEW:
      return {
        ...state,
        showRefs: action.payload
      }
    default:
      return state;
  }
}

export default referencesReducer;