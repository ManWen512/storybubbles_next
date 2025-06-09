import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authFetch } from '../lib/authFetch';

const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch a specific story by ID
export const fetchStoryAnswer = createAsyncThunk(
    "story/fetchStoryAnswer",
    async ({ storyId, userId }, { rejectWithValue }) => {
        try {
            const response = await authFetch(`${accUrl}/answer/story-answers?userId=${userId}&storyId=${storyId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data || !Array.isArray(data.answersList)) {
                throw new Error('Invalid response format');
            }

            return { 
                storyId, 
                answersList: data.answersList,
                correctCount: data.correctCount || 0
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const storyAnswerSlice = createSlice({
    name: "storyAnswer",
    initialState: {
        currentStoryId: null,
        storyAnswers: {},
        error: null,
        status: "idle",
        totalCorrectCount: 0
    },
    reducers: {
        setCurrentStoryId: (state, action) => {
            state.currentStoryId = action.payload;
        },
        clearStoryAnswers: (state) => {
            state.storyAnswers = {};
            state.error = null;
            state.status = "idle";
            state.totalCorrectCount = 0;
        },
        clearCurrentStory: (state) => {
            if (state.currentStoryId) {
                delete state.storyAnswers[state.currentStoryId];
                state.currentStoryId = null;
            }
        },
        updateAnswer: (state, action) => {
            const { storyId, questionIndex, answer, isCorrect } = action.payload;
            if (state.storyAnswers[storyId]) {
                state.storyAnswers[storyId].answersList[questionIndex] = {
                    ...state.storyAnswers[storyId].answersList[questionIndex],
                    userAnswerText: answer,
                    correct: isCorrect.toString()
                };
                // Update correct count
                state.storyAnswers[storyId].correctCount = state.storyAnswers[storyId].answersList.filter(
                    answer => answer.correct === "true"
                ).length;
                // Update total correct count
                state.totalCorrectCount = Object.values(state.storyAnswers).reduce(
                    (total, story) => total + story.correctCount, 0
                );
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStoryAnswer.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchStoryAnswer.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.storyAnswers[action.payload.storyId] = {
                    answersList: action.payload.answersList,
                    correctCount: action.payload.correctCount
                };
                // Update total correct count
                state.totalCorrectCount = Object.values(state.storyAnswers).reduce(
                    (total, story) => total + story.correctCount, 0
                );
            })
            .addCase(fetchStoryAnswer.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to fetch story answers";
            });
    }
});

export const { 
    setCurrentStoryId, 
    clearStoryAnswers, 
    clearCurrentStory,
    updateAnswer 
} = storyAnswerSlice.actions;

export default storyAnswerSlice.reducer;