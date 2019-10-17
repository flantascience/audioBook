import { createStore, combineReducers } from 'redux';
import inputReducer from './Reducers/inputReducer';
import mediaReducer from './Reducers/mediaReducer';
import referencesReducer from './Reducers/referencesReducer';

const rootReducer = combineReducers({
  input: inputReducer,
  media: mediaReducer,
  refs: referencesReducer
});

const configureStore = () => {
  return createStore(rootReducer);
}

export default configureStore;