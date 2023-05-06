import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { Root } from "react-dom/client";

export const userSlice = createSlice({
  name: "userData",
  initialState: {
    name: "Guest",
    email: "",
    id: "",
    accessToken: "",
    picture: "",
    guid: ""
  },
  reducers: {
    updateUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.accessToken = action.payload.accessToken;
      state.picture = action.payload.picture;
      state.guid = action.payload.guid;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUser } = userSlice.actions;

export const selectUserName = (state: RootState) => state.user.name;
export const selectPicture = (state: RootState) => state.user.picture;
export const selectGuid = (state: RootState) => state.user.guid;
export const selectEmail = (state: RootState) => state.user.email;


export default userSlice.reducer;
