import { createSlice } from "@reduxjs/toolkit";

type UIState = {
  loading: boolean;
};

const initialState: UIState = {
  loading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading(state, action: { payload: boolean }) {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = uiSlice.actions;
export default uiSlice.reducer;

