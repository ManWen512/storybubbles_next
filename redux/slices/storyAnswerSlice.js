import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch answers for the current story only
export const fetchStoryAnswer = createAsyncThunk(
  "story/fetchStoryAnswer",
  async ({ storyName, username }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/answers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (!data.success || !Array.isArray(data.data)) {
        throw new Error("Invalid response format");
      }

      // Filter answers for the specific story and username
      let filteredAnswers = data.data.filter(
        (answer) =>
          answer.storyName === storyName && answer.username === username
      );

      // Process the answers into the expected format
      const answersList = filteredAnswers.map((answer, index) => ({
        questionIndex: index,
        userAnswerText: answer.chosenAnswer,
        question: answer.question,
        correctAnswer: answer.correctAnswer,
        createdTime: answer.created_time,
        username: answer.username,
      }));

      return {
        storyName,
        username,
        answersList,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const storyAnswerSlice = createSlice({
  name: "storyAnswer",
  initialState: {
    currentStoryName: null,
    currentUsername: null,
    currentStoryAnswers: null, // Only store current story data
    error: null,
    status: "idle",
  },
  reducers: {
    setCurrentStoryName: (state, action) => {
      state.currentStoryName = action.payload;
    },
    setCurrentUsername: (state, action) => {
      state.currentUsername = action.payload;
    },
    clearCurrentStory: (state) => {
      state.currentStoryAnswers = null;
      state.currentStoryName = null;
      state.currentUsername = null;
      state.error = null;
      state.status = "idle";
    },
    updateAnswer: (state, action) => {
      const { questionIndex, answer, isCorrect } = action.payload;
      if (
        state.currentStoryAnswers &&
        state.currentStoryAnswers.answersList[questionIndex]
      ) {
        state.currentStoryAnswers.answersList[questionIndex] = {
          ...state.currentStoryAnswers.answersList[questionIndex],
          userAnswerText: answer,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoryAnswer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStoryAnswer.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { storyName, username, answersList } = action.payload;

        // Only store the current story data
        state.currentStoryAnswers = {
          answersList,
        };
        state.currentUsername = username;
      })
      .addCase(fetchStoryAnswer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch story answers";
      });
  },
});

export const {
  setCurrentStoryName,
  setCurrentUsername,
  clearCurrentStory,
  updateAnswer,
} = storyAnswerSlice.actions;

export default storyAnswerSlice.reducer;
