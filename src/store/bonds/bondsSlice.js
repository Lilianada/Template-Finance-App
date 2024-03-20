import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getBondRequests,
  getUserBonds,
  addNewBond,
  updateBond,
  deleteBond,
} from  "../../config/bonds";

const initialState = {
  bondRequests: [],
  userBonds: [],
  status: 'idle',
  error: null,
};


// Async thunks
export const fetchBondRequests = createAsyncThunk(
  'bonds/fetchBondRequests',
  async () => {
    const bondRequests = await getBondRequests();
    return bondRequests;
  }
);

export const fetchUserBonds = createAsyncThunk(
  'bonds/fetchUserBonds',
  async (userId) => {
    const userBonds = await getUserBonds(userId);
    return userBonds;
  }
);

export const createBond = createAsyncThunk(
  'bonds/createBond',
  async (bondData) => {
    const newBond = await addNewBond(bondData);
    return newBond;
  }
);

export const updateBondDetails = createAsyncThunk(
  'bonds/updateBond',
  async ({ bondId, updatedData }) => {
    const updatedBond = await updateBond(bondId, updatedData);
    return updatedBond;
  }
);

export const removeBond = createAsyncThunk(
  'bonds/deleteBond',
  async (bondId) => {
    await deleteBond(bondId);
    return bondId;
  }
);

const bondsSlice = createSlice({
  name: 'bonds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBondRequests.fulfilled, (state, action) => {
        state.bondRequests = action.payload;
      })
      .addCase(fetchUserBonds.fulfilled, (state, action) => {
        state.userBonds = action.payload;
        state.status = "succeeded"
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
