import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '@/redux/slices/profileSlice';


export const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});
