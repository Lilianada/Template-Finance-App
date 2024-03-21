import { combineReducers } from 'redux';
import userReducer from './user/userSlice';
import iposReducer from './ipos/iposSlice';
import termsReducer from './terms/termsSlice';
import bondsReducer from './bonds/bondsSlice';
import stocksSlice from './stocks/stocksSlice';
import cashSlice from './cash/cashSlice';

const rootReducer = combineReducers({
  user: userReducer,
  ipos: iposReducer,
  terms: termsReducer,
  bonds: bondsReducer,
  stocks: stocksSlice,
  cashDeposits: cashSlice,
});

export default rootReducer;
