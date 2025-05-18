import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authFetch } from "../lib/authFetch";

const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchStory = createAsyncThunk(
  "story/fetchStory",
  async (id) => {
    const response = await authFetch(`${accUrl}/story?storyId=${id}`);
    const data = await response.json();
    return { id, stories: data };
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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStory.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.id === 1) {
          state.storyOne = action.payload.stories;
        } else if (action.payload.id === 2) {
          state.storytwo = action.payload.stories;
        }else if (action.payload.id === 3) {
            state.storythree = action.payload.stories;
          }
      })
      .addCase(fetchStory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default storySlice.reducer;
