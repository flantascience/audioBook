import { STORE_INPUT } from '../Actions/types';

const initialState = {
  userEmail: ''
};

const inputReducer = (state = initialState, action) => {
  switch(action.type) {
    case STORE_INPUT:
      return {
        ...state,
        userEmail: action.payload,
      };
    default:
      return state;
  }
}

export default inputReducer;