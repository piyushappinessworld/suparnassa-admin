
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import propertyReducer from './properties/propertySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
