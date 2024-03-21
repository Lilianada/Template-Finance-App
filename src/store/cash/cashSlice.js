import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllCashDeposits,
  getUserCashDeposits,
  addCashDeposit,
  updateCashDeposit,
  deleteCashDeposit,
} from '../../config/cashBalance';

// Initial state and reducers
const initialState = {
    cashDeposits: [],
    userCashDeposits: [],
    status: 'idle',
    error: null,
  };

// Async thunks
export const fetchAllCashDeposits = createAsyncThunk(
  'cashDeposits/fetchAllCashDeposits',
  async () => {
    const cashDeposits = await getAllCashDeposits();
    return cashDeposits;
  }
);

export const fetchUserCashDeposits = createAsyncThunk(
  'cashDeposits/fetchUserCashDeposits',
  async (userId) => {
    const userCashDeposits = await getUserCashDeposits(userId);
    return userCashDeposits;
  }
);

export const addNewCashDeposit = createAsyncThunk(
  'cashDeposits/addNewCashDeposit',
  async ({ userId, depositData }) => {
    const response = await addCashDeposit(userId, depositData);
    return response;
  }
);

export const updateExistingCashDeposit = createAsyncThunk(
  'cashDeposits/updateExistingCashDeposit',
  async ({ userId, depositId, updatedData }) => {
    try {
      const response = await updateCashDeposit(userId, depositId, updatedData);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteExistingCashDeposit = createAsyncThunk(
  'cashDeposits/deleteExistingCashDeposit',
  async ({ userId, depositId }) => {
    const response = await deleteCashDeposit(userId, depositId);
    return response;
  }
);


const cashDepositsSlice = createSlice({
  name: 'cashDeposits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCashDeposits.fulfilled, (state, action) => {
        state.cashDeposits = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchUserCashDeposits.fulfilled, (state, action) => {
        state.userCashDeposits = action.payload;
        state.status = 'succeeded';
      })
      .addCase(addNewCashDeposit.fulfilled, (state, action) => {
        state.cashDeposits.push(action.payload);
      })
      .addCase(updateExistingCashDeposit.fulfilled, (state, action) => {
        const index = state.cashDeposits.findIndex(
          (deposit) => deposit.id === action.payload.id
        );
        if (index !== -1) {
          state.cashDeposits[index] = action.payload;
        }
      })
      .addCase(deleteExistingCashDeposit.fulfilled, (state, action) => {
        state.cashDeposits = state.cashDeposits.filter(
          (deposit) => deposit.id !== action.payload
        );
      });
  },
});

export default cashDepositsSlice.reducer;
