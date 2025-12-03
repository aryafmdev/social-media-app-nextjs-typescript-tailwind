import { createSlice } from "@reduxjs/toolkit";

type UIState = {
  loading: boolean;
  mobileAuthOpen: boolean;
};

const initialState: UIState = {
  loading: false,
  mobileAuthOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading(state, action: { payload: boolean }) {
      state.loading = action.payload;
    },
    setMobileAuthOpen(state, action: { payload: boolean }) {
      state.mobileAuthOpen = action.payload;
    },
  },
});

export const { setLoading, setMobileAuthOpen } = uiSlice.actions;
export default uiSlice.reducer;
