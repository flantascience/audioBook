import { createStore, combineReducers } from 'redux';
import generalReducer from './Reducers/generalReducer';
import mediaReducer from './Reducers/mediaReducer';
import referencesReducer from './Reducers/referencesReducer';

const rootReducer = combineReducers({
  input: generalReducer,
  connectionInfo: generalReducer,
  media: mediaReducer,
  refs: referencesReducer
});

const configureStore = () => {
  return createStore(rootReducer);
}

export default configureStore;