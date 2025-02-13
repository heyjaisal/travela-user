import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slice/auth";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});