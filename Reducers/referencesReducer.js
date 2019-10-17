import { STORE_REFERENCES, TOGGLE_REFS_VIEW  } from '../Actions/types';

const initialState = {
  references: [],
  showRefs: false
};

const referencesReducer = (state = initialState, action) => {
  switch(action.type) {
    
    case STORE_REFERENCES:
      return {
        ...state,
        references: action.payload,
      };
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