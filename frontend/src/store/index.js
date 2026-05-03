import { configureStore } from "@reduxjs/toolkit";
import targetReducer from "./targetSlice";

export const store = configureStore({
  reducer: {
    targets: targetReducer,
  },
});
