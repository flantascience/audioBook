import { createStore, combineReducers } from 'redux';
import inputReducer from './Reducers/inputReducer';
import mediaReducer from './Reducers/mediaReducer';

const rootReducer = combineReducers({
  input: inputReducer,
  media: mediaReducer
});

const configureStore = () => {
  return createStore(rootReducer);
}

export default configureStore;