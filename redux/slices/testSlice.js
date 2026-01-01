// redux/slices/testSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch tests from /api/test
export const fetchTests = createAsyncThunk(
  "tests/fetchTests",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/test");
      if (!res.ok) {
        throw new Error("Failed to fetch tests");
      }
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSUS = createAsyncThunk(
  "tests/fetchSUS",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/SUS");
      if (!res.ok) {
        throw new Error("Failed to fetch SUStests");
      }
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitTestAnswers = createAsyncThunk(
  "tests/submit",
  async ({ username, type, answers }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/test-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, type, answers }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit test answers");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const testSlice = createSlice({
  name: "tests",
  initialState: {
    tests: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetTestAnswerState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(fetchSUS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSUS.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchSUS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(submitTestAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitTestAnswers.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitTestAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetTestAnswerState } = testSlice.actions;
export default testSlice.reducer;
