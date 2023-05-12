import { createSlice, PayloadAction, Reducer } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { ICoordinate } from "../types";

interface UserState {
  name: string;
  email: string;
  id: string;
  accessToken: string;
  picture: string;
  guid: string;
  address: ICoordinate;
}

interface PartialUserState {
  picture: string;
  guid: string;
}

export const initialState: UserState = {
  name: "Guest",
  email: "",
  id: "",
  accessToken: "",
  picture: "",
  guid: "",
  address: { latitude: 0, longitude: 0 },
};

export const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.accessToken = action.payload.accessToken;
      state.picture = action.payload.picture;
      state.guid = action.payload.guid;
    },
    updatePartialUser: (state, action: PayloadAction<PartialUserState>) => {
      state.picture = action.payload.picture;
      state.guid = action.payload.guid;
    },
    updateAddress: (state, action: PayloadAction<ICoordinate>) => {
      state.address = action.payload;
    },
  },
});

// Specify the type of the state that the slice manages
const userSliceReducer = userSlice.reducer as Reducer<UserState>;

// Action creators are generated for each case reducer function
export const {
  updateUser,
  updatePartialUser,
  updateAddress,
} = userSlice.actions;

export const selectUserName = (state: RootState) => state.user.name;
export const selectPicture = (state: RootState) => state.user.picture;
export const selectGuid = (state: RootState) => state.user.guid;
export const selectEmail = (state: RootState) => state.user.email;
export const selectAddress = (state: RootState) => state.user.address;

export default userSliceReducer;
