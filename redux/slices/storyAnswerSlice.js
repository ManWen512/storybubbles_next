import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authFetch } from '../lib/authFetch';

const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch a specific story by ID
export const fetchStoryAnswer = createAsyncThunk(
    "story/fetchStoryAnswer",
    async ({ storyId, userId }) => {
        const response = await authFetch(`${accUrl}/answer/story-answer?userId=${userId}&storyId=${storyId}`);
        const data = await response.json();
        return { 
            storyId, 
            answersList: data.answersList,
            correctCount: data.correctCount 
        };
    });

const storyAnswerSlice = createSlice({
    name: "storyAnswer",
    initialState: {
        currentStoryId: null,
        storyAnswers: {},
        error: null,
        status: "idle",
    },
    reducers: {
        setCurrentStoryId: (state, action) => {
            state.currentStoryId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStoryAnswer.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchStoryAnswer.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.storyAnswers[action.payload.storyId] = {
                    answersList: action.payload.answersList,
                    correctCount: action.payload.correctCount
                };
            })
            .addCase(fetchStoryAnswer.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
    }
})

export const { setCurrentStoryId } = storyAnswerSlice.actions;
export default storyAnswerSlice.reducer;