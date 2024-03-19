import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, deleteUser as deleteFirebaseUser } from "firebase/auth";
import { db } from "../../config/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { addUserToFirebase, getRegisteredUsers, updateUser } from "../../config/user";

export const fetchUsersAsync = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await getRegisteredUsers();
    return response;
  }
);

export const addUserAsync = createAsyncThunk(
  'users/addUser',
  async (userDetails, { rejectWithValue }) => {
    try {
      const response = await addUserToFirebase(userDetails); 
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  'users/updateUser',
  async ({userId, userDetails}, { rejectWithValue }) => {
    try {
      const response = await updateUser(userId, userDetails);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);

      const auth = getAuth();
      const user = auth.currentUser;

      if (user && user.uid === userId) {
        await deleteFirebaseUser(user);
      }

      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Reducers for other user actions if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsersAsync.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addUserAsync.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  }
});

// No need to export individual reducers for addUser and editUser as they are now part of async thunks
export default userSlice.reducer;
