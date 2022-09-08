import { createSlice } from "@reduxjs/toolkit";

const initState = {
  txns: [],
};

const transactionsReducer = createSlice({
  name: "transactionsReducer",
  initialState: initState,
  reducers: {
    addTxn: (state, action) => {
      console.log(action.payload);
      state.txns.push({ ...action.payload });
      // state.txns.push({ ...action.payload, txnIdx: state.txns.length + 1 });
    },
    removeTxn: (state, action) => {
      state.txns.splice(action.payload.txnId, 1);
    },
  },
});

export default transactionsReducer.reducer;

export const { addTxn, removeTxn } = transactionsReducer.actions;
