import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch answers
export const fetchAnswers = createAsyncThunk(
  "answers/fetchAnswers",
  async (story, { rejectWithValue }) => {
    try {
      const username = localStorage.getItem("username"); // directly from localStorage

      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, story })
      });

      if (!res.ok) throw new Error("Failed to fetch answers");

      const data = await res.json();

      // Transform response: split answer and isCorrect
      const transformedData = data.data.map(item => {
        const transformedStory = {};

        if (story) {
          transformedStory[story] = Object.keys(item[story]).reduce((acc, key) => {
            const [answer, isCorrect] = item[story][key]?.split(",") || ["", "false"];
            acc[key] = {
              answer: answer.trim(),
              isCorrect: isCorrect?.trim() === "true"
            };
            return acc;
          }, {});
        } else {
          ["story1", "story2", "story3"].forEach(s => {
            transformedStory[s] = Object.keys(item[s]).reduce((acc, key) => {
              const [answer, isCorrect] = item[s][key]?.split(",") || ["", "false"];
              acc[key] = {
                answer: answer.trim(),
                isCorrect: isCorrect?.trim() === "true"
              };
              return acc;
            }, {});
          });
        }

        return {
          id: item.id,
          ...transformedStory,
          created_time: item.created_time,
          last_edited_time: item.last_edited_time
        };
      });

      return transformedData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const saveAnswerSlice = createSlice({
  name: "answers",
  initialState: {
    answers: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAnswers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.answers = action.payload;
      })
      .addCase(fetchAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default saveAnswerSlice.reducer;
