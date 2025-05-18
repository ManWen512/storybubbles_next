import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '@/redux/slices/profileSlice';
import testReducer from "@/redux/slices/testSlice";
import storyReducer from "@/redux/slices/storySlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    test: testReducer,
    story: storyReducer,
  },
});
