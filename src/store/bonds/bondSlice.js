import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getBondRequests,
  getUserBonds,
  addNewBond,
  updateBond,
  deleteBond,
} from  "../../config/bonds";

// Async thunks
export const fetchBondRequests = createAsyncThunk(
  'bonds/fetchBondRequests',
  async () => {
    const response = await getBondRequests();
    return response;
  }
);

export const fetchUserBonds = createAsyncThunk(
  'bonds/fetchUserBonds',
  async (userId) => {
    const response = await getUserBonds(userId);
    return response;
  }
);

export const createBond = createAsyncThunk(
  'bonds/createBond',
  async (bondData) => {
    const response = await addNewBond(bondData);
    return response;
  }
);

export const updateBondDetails = createAsyncThunk(
  'bonds/updateBond',
  async ({ bondId, updatedData }) => {
    const response = await updateBond(bondId, updatedData);
    return response;
  }
);

export const removeBond = createAsyncThunk(
  'bonds/deleteBond',
  async (bondId) => {
    const response = await deleteBond(bondId);
    return response;
  }
);

// Initial state and reducers
const initialState = {
  bondRequests: [],
  userBonds: [],
  status: 'idle',
  error: null,
};

const bondsSlice = createSlice({
  name: 'bonds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add cases for handling lifecycle of each async thunk
    builder
      .addCase(fetchBondRequests.fulfilled, (state, action) => {
        state.bondRequests = action.payload;
      })
      .addCase(fetchUserBonds.fulfilled, (state, action) => {
        state.userBonds = action.payload;
      })
      .addCase(createBond.fulfilled, (state, action) => {
        state.userBonds.push(action.payload);
      })
      .addCase(updateBondDetails.fulfilled, (state, action) => {
        const index = state.userBonds.findIndex(bond => bond.id === action.payload.id);
        if (index !== -1) {
          state.userBonds[index] = action.payload;
        }
      })
      .addCase(removeBond.fulfilled, (state, action) => {
        state.userBonds = state.userBonds.filter(bond => bond.id !== action.payload);
      });
  },
});

export default bondsSlice.reducer;
