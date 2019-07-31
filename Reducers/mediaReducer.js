import { STORE_MEDIA } from '../Actions/types';

const initialState = {
  mediaFiles: []
};

const mediaReducer = (state = initialState, action) => {
  switch(action.type) {
    case STORE_MEDIA:
      return {
        ...state,
        mediaFiles: action.payload,
      };
    default:
      return state;
  }
}

export default mediaReducer;