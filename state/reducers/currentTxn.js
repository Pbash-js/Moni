import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  txnAmount: 0,
  txnCategory: "",
  txnType: "Expense",
  txnDate: "",
  txnNote: "",
};

export const currentTxnSlice = createSlice({
  name: "currentTxn",
  initialState,
  reducers: {
    setTxnAmount: (state, action) => {
      state.txnAmount = parseInt(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTxnAmount } = currentTxnSlice.actions;

export default currentTxnSlice.reducer;
