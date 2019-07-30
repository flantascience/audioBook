import { createStore, combineReducers } from 'redux';
import inputReducer from './Reducers/inputReducer';

const rootReducer = combineReducers({
  input: inputReducer
});

const configureStore = () => {
  return createStore(rootReducer);
}

export default configureStore;