import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '@/redux/slices/profileSlice';
import testReducer from "@/redux/slices/testSlice";
import storyReducer from "@/redux/slices/storySlice";
import helloReducer from "@/redux/slices/helloSlice";
import storyAnswerReducer from '@/redux/slices/storyAnswerSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    test: testReducer,
    story: storyReducer,
    hello: helloReducer,
    storyAnswer: storyAnswerReducer,
  },
});
