import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// Fetch a specific story by ID
export const fetchStoryAnswer = createAsyncThunk(
    "story/fetchStoryAnswer",
    async ({ storyId, userId }) => {
        const response = await fetch(`/api/story-answer?userId=${userId}&storyId=${storyId}`);
        const data = await response.json();
        return { answerLists: data.answerLists };
    });

const storyAnswerSlice = createSlice({
    name: "storyAnswer",
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
            // Fetch story logic
            .addCase(fetchStoryAnswer.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchStoryAnswer.fulfilled, (state, action) => {
                state.status = "succeeded";
                if (action.payload.id === 1) {
                    state.storyAnswerOne = action.payload.answerLists;
                } else if (action.payload.id === 2) {
                    state.storyAnswerTwo = action.payload.answerLists;
                } else if (action.payload.id === 3) {
                    state.storyAnswerThree = action.payload.answerLists;
                }
            })
            .addCase(fetchStoryAnswer.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
    }
})

export default storyAnswerSlice.reducer;