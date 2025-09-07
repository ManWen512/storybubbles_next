import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authFetch } from "../lib/authFetch";

const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch a specific story by ID
export const fetchStory = createAsyncThunk(
  "story/fetchStory",
  async (id) => {
    const response = await authFetch(`${accUrl}/story?storyId=${id}`);
    const data = await response.json();
    return { id, stories: data };
  }
);

// redux/slices/storySlice.js
export const submitStoryAnswer = createAsyncThunk(
  'story/submitAnswer',
  async ({ username, storyName, questionNumber, answer }) => {
    const response = await fetch('/api/save-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        storyName,
        questionNumber,
        answer
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save answer');
    }

    return await response.json();
  }
);

const storySlice = createSlice({
  name: "story",
  initialState: {
    storyOne: [],
    storytwo: [],
    storythree: [],
    error: null,
    status: "idle",
    answerStatus: "idle",
    submittedAnswer: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch story logic
      .addCase(fetchStory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStory.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.id === 1) {
          state.storyOne = action.payload.stories;
        } else if (action.payload.id === 2) {
          state.storytwo = action.payload.stories;
        } else if (action.payload.id === 3) {
          state.storythree = action.payload.stories;
        }
      })
      .addCase(fetchStory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Submit answer logic
      .addCase(submitStoryAnswer.pending, (state) => {
        state.answerStatus = "loading";
      })
      .addCase(submitStoryAnswer.fulfilled, (state, action) => {
        state.answerStatus = "succeeded";
        state.submittedAnswer = action.payload;
      })
      .addCase(submitStoryAnswer.rejected, (state, action) => {
        state.answerStatus = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default storySlice.reducer;