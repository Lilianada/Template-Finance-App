import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllTerms,
  addNewTerm,
  updateTerm,
  deleteTerm,
  getTermRequests,
  handleWithdrawalApproval,
  handleDepositApproval,
  updateFixedTermRequestStatus,
  deleteFixedTermRequestStatus,
  getUserFixedTerm,
} from "../../config/terms"; 

const initialState = {
  terms: [],
  userTerms: [],
  status: "idle",
  error: null,
};

// Async thunk action to fetch all terms
export const fetchAllTerms = createAsyncThunk(
  "terms/fetchAllTerms",
  async () => {
    const terms = await getAllTerms();
    return terms;
  }
);


export const fetchUserTerms = createAsyncThunk(
  'terms/fetchUserTerms',
  async (userId) => {
    const userTerms = await getUserFixedTerm(userId);
    return userTerms;
  }
);

// Async thunk action to add a new term
export const addTerm = createAsyncThunk(
  "terms/addTerm",
  async (termData) => {
    await addNewTerm(termData);
    return termData;
  }
);

// Async thunk action to update a term
export const updateTermAsync = createAsyncThunk(
  "terms/updateTerm",
  async ({ termId, updatedData }) => {
    await updateTerm(termId, updatedData);
    return { termId, updatedData };
  }
);

// Async thunk action to delete a term
export const deleteTermAsync = createAsyncThunk(
  "terms/deleteTerm",
  async (termId) => {
    await deleteTerm(termId);
    return termId;
  }
);

// Async thunk action to fetch all term requests
export const fetchAllTermRequests = createAsyncThunk(
  "terms/fetchAllTermRequests",
  async () => {
    const requests = await getTermRequests();
    return requests;
  }
);

// Async thunk action to handle withdrawal approval
export const approveWithdrawal = createAsyncThunk(
  "terms/approveWithdrawal",
  async ({ userId, termData }) => {
    await handleWithdrawalApproval(userId, termData);
    return { userId, termData };
  }
);

// Async thunk action to handle deposit approval
export const approveDeposit = createAsyncThunk(
  "terms/approveDeposit",
  async ({ userId, termData }) => {
    await handleDepositApproval(userId, termData);
    return { userId, termData };
  }
);

// Async thunk action to update term request status
export const updateRequestStatus = createAsyncThunk(
  "terms/updateRequestStatus",
  async ({ userId, requestId, newStatus }) => {
    await updateFixedTermRequestStatus(userId, requestId, newStatus);
    return { userId, requestId, newStatus };
  }
);

// Async thunk action to delete term request
export const deleteRequest = createAsyncThunk(
  "terms/deleteRequest",
  async ({ userId, requestId }) => {
    await deleteFixedTermRequestStatus(userId, requestId);
    return { userId, requestId };
  }
);



const termsSlice = createSlice({
  name: "terms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all terms reducer
    builder
    .addCase(fetchAllTerms.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchAllTerms.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.terms = action.payload;
    });
    builder.addCase(fetchUserTerms.fulfilled, (state, action) => {
      state.userTerms = action.payload;
    })
    builder.addCase(fetchAllTerms.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    // Add term reducer
    builder.addCase(addTerm.fulfilled, (state, action) => {
      state.terms.push(action.payload);
    });

    // Update term reducer
    builder.addCase(updateTermAsync.fulfilled, (state, action) => {
      const { termId, updatedData } = action.payload;
      const existingTermIndex = state.terms.findIndex(
        (term) => term.id === termId
      );
      if (existingTermIndex !== -1) {
        state.terms[existingTermIndex] = updatedData;
      }
    });

    // Delete term reducer
    builder.addCase(deleteTermAsync.fulfilled, (state, action) => {
      const termId = action.payload;
      state.terms = state.terms.filter((term) => term.id !== termId);
    });

    // Fetch all term requests reducer
    builder.addCase(fetchAllTermRequests.fulfilled, (state, action) => {
      state.requests = action.payload;
    });

    // Handle withdrawal approval reducer
    builder.addCase(approveWithdrawal.fulfilled, (state, action) => {
      // Update state if necessary
    });

    // Handle deposit approval reducer
    builder.addCase(approveDeposit.fulfilled, (state, action) => {
      // Update state if necessary
    });

    // Update term request status reducer
    builder.addCase(updateRequestStatus.fulfilled, (state, action) => {
      // Update state if necessary
    });

    // Delete term request reducer
    builder.addCase(deleteRequest.fulfilled, (state, action) => {
      // Update state if necessary
    });
  },
});

export default termsSlice.reducer;

// Selectors
export const selectAllTerms = (state) => state.terms.terms;
export const selectUserTerms = (state) => state.terms.userTerms;
export const selectTermById = (state, termId) =>
  state.terms.terms.find((term) => term.id === termId);
export const selectTermStatus = (state) => state.terms.status;
export const selectTermError = (state) => state.terms.error;
export const selectAllTermRequests = (state) => state.terms.requests;
export const selectTermRequestById = (state, requestId) =>
  state.terms.requests.find((request) => request.id === requestId);
