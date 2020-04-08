import { 
  STORE_INPUT, 
  SLOW_CONNECTION, 
  NO_CONNECTION, 
  CONNECTED, 
  SET_START_TRACKS ,
  SET_USER_TYPE,
  UPDATE_SHOW_PURCHASE_OVERVIEW,
  UPDATE_PURCHASING,
  UPDATE_IS_PURCHASING
} from '../Actions/types';

const initialState = {
  userEmail: '',
  isPurchasing: false,
  purchasing: false,
  showPurchaseOverview: false,
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
    case SET_USER_TYPE: {
      return {
        ...state,
        userType: action.payload
      }
    }
    case UPDATE_SHOW_PURCHASE_OVERVIEW: {
      return {
        ...state,
        showPurchaseOverview: action.payload
      }
    }
    case UPDATE_PURCHASING: {
      return {
        ...state,
        purchasing: action.payload
      }
    }
    case UPDATE_IS_PURCHASING: {
        return {
            ...state,
            isPurchasing: action.payload
        }
    }
    default:
      return state;
  }
}

export default generalReducer;