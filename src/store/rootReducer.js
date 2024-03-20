import { combineReducers } from 'redux';
import userReducer from './user/userSlice';
import iposReducer from './ipos/iposSlice';
import termsReducer from './terms/termsSlice';
import bondsReducer from './bonds/bondsSlice';

const rootReducer = combineReducers({
  user: userReducer,
  ipos: iposReducer,
  terms: termsReducer,
  bonds: bondsReducer,
});

export default rootReducer;
