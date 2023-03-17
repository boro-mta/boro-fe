import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export const userSlice = createSlice({
  name: "userData",
  initialState: {
    name: "yoske",
    email: "",
    id: "",
    accessToken: "",
  },
  reducers: {
    updateUser: (state, action) => {
      debugger;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.accessToken = action.payload.accessToken;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUser } = userSlice.actions;

export const selectUserName = (state: RootState) => state.user.name;

export default userSlice.reducer;
