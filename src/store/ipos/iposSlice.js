import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllIpos,
  addNewIpos,
  updateIpo,
  deleteIpos,
  getIposRequests,
  handleIpoApproval,
  handleIpoDecline,
} from "../../config/ipos"; 
import { getUserIpos } from "../../config/ipos";

const initialState = {
  ipos: [],
  userIpos: [],
  requests: [],
  status: "idle",
  error: null,
};

// Async thunks
export const fetchAllIpos = createAsyncThunk("ipos/fetchAllIpos", async () => {
  const ipos = await getAllIpos();
  return ipos;
});

export const fetchUserIpos = createAsyncThunk(
  "ipos/fetchUserIpos",
  async (userId) => {
    const userIpos = await getUserIpos(userId);
    return userIpos;
  }
);

export const addNewIpo = createAsyncThunk("ipos/addNewIpo", async (ipoData) => {
  const ipoId = await addNewIpos(ipoData);
  return { id: ipoId, data: ipoData };
});

export const updateExistingIpo = createAsyncThunk(
  "ipos/updateExistingIpo",
  async ({ ipoId, updatedData }) => {
    await updateIpo(ipoId, updatedData);
    return { id: ipoId, updatedData };
  }
);

export const deleteExistingIpo = createAsyncThunk(
  "ipos/deleteExistingIpo",
  async (ipoId) => {
    await deleteIpos(ipoId);
    return { id: ipoId };
  }
);

export const fetchAllIpoRequests = createAsyncThunk(
  "ipos/fetchAllIpoRequests",
  async () => {
    const requests = await getIposRequests();
    return requests;
  }
);

export const approveIpo = createAsyncThunk(
  "ipos/approveIpo",
  async ({ uid, requestId, requestData }) => {
    await handleIpoApproval(uid, requestId, requestData);
    return { requestId };
  }
);

export const declineIpo = createAsyncThunk(
  "ipos/declineIpo",
  async ({ uid, requestId }) => {
    await handleIpoDecline(uid, requestId);
    return { requestId };
  }
);

// Slice
const iposSlice = createSlice({
  name: "ipos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllIpos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ipos = action.payload;
      })
      .addCase(fetchAllIpos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUserIpos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userIpos = action.payload;
      })
      .addCase(addNewIpo.fulfilled, (state, action) => {
        state.ipos.push({ ...action.payload.data, id: action.payload.id });
      })
      .addCase(updateExistingIpo.fulfilled, (state, action) => {
        const { id, updatedData } = action.payload;
        const index = state.ipos.findIndex((ipo) => ipo.id === id);
        if (index !== -1) {
          state.ipos[index] = { ...state.ipos[index], ...updatedData };
        }
      })
      .addCase(deleteExistingIpo.fulfilled, (state, action) => {
        state.ipos = state.ipos.filter((ipo) => ipo.id !== action.payload.id);
      })
      .addCase(fetchAllIpoRequests.fulfilled, (state, action) => {
        state.requests = action.payload;
      })
      .addCase(approveIpo.fulfilled, (state, action) => {
        // Handle if necessary
      })
      .addCase(declineIpo.fulfilled, (state, action) => {
        // Handle if necessary
      });
  },
});

// Selectors
export const selectAllIpos = (state) => state.ipos.ipos;
export const selectUserIpos = (state) => state.ipos.userIpos;
export const selectAllIpoRequests = (state) => state.ipos.requests;
export const selectIpoById = (state, ipoId) =>
  state.ipos.ipos.find((ipo) => ipo.id === ipoId);
export const selectIpoRequestById = (state, requestId) =>
  state.ipos.requests.find((request) => request.id === requestId);
export const selectIpoStatus = (state) => state.ipos.status;
export const selectIpoError = (state) => state.ipos.error;

export default iposSlice.reducer;
