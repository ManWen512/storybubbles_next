import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch } from '../lib/authFetch';

const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch profile images
export const fetchProfileImages = createAsyncThunk(
  'profile/fetchProfileImages',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authFetch(`${accUrl}/user/profile-images`);
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Create user
export const createUser = createAsyncThunk(
  'profile/createUser',
  async ({ username, profileImage }, { rejectWithValue }) => {
    try {
      const res = await authFetch(`${accUrl}/user/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, profileImage }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    images: [],
    loading: false,
    error: null,
    createStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    createError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch profile images
      .addCase(fetchProfileImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchProfileImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.createStatus = 'succeeded';
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload || action.error.message;
      });
  },
});

export default profileSlice.reducer;