import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UIState = {
  loading: boolean;
  mobileAuthOpen: boolean;
  mobileSearchOpen: boolean;
};

const initialState: UIState = {
  loading: false,
  mobileAuthOpen: false,
  mobileSearchOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setMobileAuthOpen(state, action: PayloadAction<boolean>) {
      state.mobileAuthOpen = action.payload;
    },
    setMobileSearchOpen(state, action: PayloadAction<boolean>) {
      state.mobileSearchOpen = action.payload;
    },
  },
});

export const { setLoading, setMobileAuthOpen, setMobileSearchOpen } = uiSlice.actions;
export default uiSlice.reducer;
