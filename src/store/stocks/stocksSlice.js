import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getStockFromUserDB,
  addStockToPortfolio,
  editStockPortfolio,
  updateStockPortfolio,
  deleteStockFromDb,
} from '../../config/stock';

// Async thunks
export const fetchUserStocks = createAsyncThunk(
  'stockPortfolio/fetchUserStocks',
  async (userId) => {
    const userStocks = await getStockFromUserDB(userId);
    return userStocks;
  }
);

export const addNewStock = createAsyncThunk(
  'stockPortfolio/addNewStock',
  async ({ userId, stockData }) => {
    const response = await addStockToPortfolio(userId, stockData);
    return response;
  }
);

export const editExistingStock = createAsyncThunk(
  'stockPortfolio/editExistingStock',
  async ({ userId, stockId, updatedStockData }) => {
    const response = await editStockPortfolio(userId, stockId, updatedStockData);
    return response;
  }
);

export const updateStock = createAsyncThunk(
  'stockPortfolio/updateStock',
  async ({ userId, stockData }) => {
    await updateStockPortfolio(userId, stockData);
  }
);

export const deleteStock = createAsyncThunk(
  'stockPortfolio/deleteStock',
  async ({ userId, stockId }) => {
    await deleteStockFromDb(userId, stockId);
    return stockId;
  }
);

// Initial state and reducers
const initialState = {
  userStocks: [],
  status: 'idle',
  error: null,
};

const stockPortfolioSlice = createSlice({
  name: 'stockPortfolio',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStocks.fulfilled, (state, action) => {
        state.userStocks = action.payload;
        state.status = 'succeeded';
      })
      .addCase(addNewStock.fulfilled, (state, action) => {
        state.stocks.push(action.payload);
      })
      .addCase(editExistingStock.fulfilled, (state, action) => {
        // Update the corresponding stock data in the state
        const index = state.stocks.findIndex(stock => stock.id === action.payload.id);
        if (index !== -1) {
          state.stocks[index] = action.payload;
        }
      })
      .addCase(deleteStock.fulfilled, (state, action) => {
        // Remove the deleted stock from the state
        state.stocks = state.stocks.filter(stock => stock.id !== action.payload);
      });
  },
});

export default stockPortfolioSlice.reducer;
