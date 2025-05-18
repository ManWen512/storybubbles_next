import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch } from '../lib/authFetch';

const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch profile images
export const fetchHello = createAsyncThunk(
  'hello/fetchHello',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authFetch(`${accUrl}/hello`);
      const data = await res.text();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const helloSlice = createSlice({
    name: 'hello',
    initialState:{
        data:'',
        loading:false,
        error: null,
    },
    reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch profile images
      .addCase(fetchHello.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHello.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHello.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
    }   
});

export default helloSlice.reducer;