import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// Fetch a specific story by ID
export const fetchStory = createAsyncThunk(
  "story/fetchStory", 
  async (id) => {
  const response = await fetch(`/api/story?storyId=${id}`);
  const data = await response.json();
  return { id, stories: data };
});

// Submit an answer to the backend
export const submitStoryAnswer = createAsyncThunk(
  "story/submitStoryAnswer",
  async ({ questionId, chosenAnswer, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/answer`, {
        method: "POST",
        body: JSON.stringify({
          questionId,
          chosenAnswer,
          userId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result; // return the saved answer response
    } catch (error) {
      return rejectWithValue(error.message);
    }
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
