import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '@/redux/slices/profileSlice';
import testReducer from "@/redux/slices/testSlice";
import storyReducer from "@/redux/slices/storySlice";
import helloReducer from "@/redux/slices/helloSlice";
import storyAnswerReducer from '@/redux/slices/storyAnswerSlice';
import questionReducer from '@/redux/slices/questionSlice';


export const store = configureStore({
  reducer: {
    profile: profileReducer,
    tests: testReducer,
    story: storyReducer,
    hello: helloReducer,
    answers: storyAnswerReducer,
    questions: questionReducer,
 
  },
});
