import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth";
import chatReducer from "./slice/chat-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});