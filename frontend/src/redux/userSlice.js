import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  name: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
     state.id = action.payload._id || action.payload.id;
      state.name = action.payload.name;
      state.token = action.payload.token;
      // also store in localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.id = null;
      state.name = null;
      state.token = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
