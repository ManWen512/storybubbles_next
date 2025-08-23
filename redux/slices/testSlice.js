import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authFetch } from "../lib/authFetch";

const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch Test Questions (Pre = 1, Post = 2)
export const fetchTest = createAsyncThunk(
  "test/fetchTest",
  async (id) => {
    const response = await authFetch(`${accUrl}/test?testId=${id}`);
    const data = await response.json();
    return { id, questions: data.questions };
  }
);


const testSlice = createSlice({
  name: "test",
  initialState: {
    preTest: [],
    postTest: [],
    error: null,
    status: "idle",
    submissionStatus: "idle", // for tracking submission state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetching test
      .addCase(fetchTest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTest.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.id === 1) {
          state.preTest = action.payload.questions;
        } else if (action.payload.id === 2) {
          state.postTest = action.payload.questions;
        }
      })
      .addCase(fetchTest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

     
  },
});

export default testSlice.reducer;