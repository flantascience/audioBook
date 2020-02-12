import { STORE_INPUT, SLOW_CONNECTION, NO_CONNECTION, CONNECTED } from '../Actions/types';

const initialState = {
  userEmail: '',
  connection: 'normal',
  connectionChecked: false,
  connected: true
};

const generalReducer = (state = initialState, action) => {
  switch(action.type) {
    case STORE_INPUT:
      return {
        ...state,
        userEmail: action.payload,
      };
    case SLOW_CONNECTION: 
      return {
        ...state,
        connection: 'slow',
        connectionChecked: true
      }
    case CONNECTED: 
      return {
        ...state,
        connection: action.payload,
        connected: true,
        connectionChecked: true
      }
    case NO_CONNECTION:
      return {
        ...state,
        connection: 'none',
        connected: false,
        connectionChecked: true
      }
    default:
      return state;
  }
}

export default generalReducer;