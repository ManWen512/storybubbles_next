import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch Test Questions (Pre = 1, Post = 2)
export const fetchTest = createAsyncThunk(
  "test/fetchTest",
  async (id) => {
    const response = await fetch(`/api/test?testId=${id}`);
    const data = await response.json();
    return { id, questions: data.questions };
  }
);

// Submit Test Answers (Pre/Post)
export const submitTestAnswers = createAsyncThunk(
  "test/submitTestAnswers",
  async ({ userId, answers }, { rejectWithValue }) => {
    try {
      const payload = {
        userId,
        questionsAnswers: answers, // send as-is: { "1": 3, "2": 4 }
      };

      const response = await fetch(`/api/submit_test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log(payload)

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit test answers");
      }

      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
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

      // Submitting answers
      .addCase(submitTestAnswers.pending, (state) => {
        state.submissionStatus = "loading";
      })
      .addCase(submitTestAnswers.fulfilled, (state) => {
        state.submissionStatus = "succeeded";
      })
      .addCase(submitTestAnswers.rejected, (state, action) => {
        state.submissionStatus = "failed";
        state.error = action.payload || "Submission failed";
      });
  },
});

export default testSlice.reducer;
