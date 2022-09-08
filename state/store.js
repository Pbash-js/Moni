import { configureStore } from "@reduxjs/toolkit";
import currentTxn from "./reducers/currentTxn";

export const store = configureStore({
  reducer: {
    currentTxn: currentTxn,
  },
});
