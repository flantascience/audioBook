import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import generalReducer from './Reducers/generalReducer';
import mediaReducer from './Reducers/mediaReducer';
import referencesReducer from './Reducers/referencesReducer';

const rootReducer = combineReducers({
  input: generalReducer,
  generalInfo: generalReducer,
  connectionInfo: generalReducer,
  media: mediaReducer,
  refs: referencesReducer
});

const configureStore = () => {
  return createStore(rootReducer, applyMiddleware(thunk, logger));
}

export default configureStore;