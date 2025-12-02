import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  name?: string;
  username?: string;
  email: string;
  phone?: string;
};

type AuthState = {
  token?: string;
  user?: User;
};

const initialState: AuthState = {};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthState>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearAuth(state) {
      state.token = undefined;
      state.user = undefined;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;

