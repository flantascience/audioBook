import { 
  STORE_INPUT, 
  SLOW_CONNECTION, 
  NO_CONNECTION, 
  CONNECTED, 
  SET_START_TRACKS 
} from '../Actions/types';

const initialState = {
  userEmail: '',
  startTracks: false,
  connection: 'normal',
  connectionChecked: false,
  connected: true,
  userType: 'free'
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
    case SET_START_TRACKS: {
      return {
        ...state,
        startTracks: action.payload
      }
    }
    default:
      return state;
  }
}

export default generalReducer;