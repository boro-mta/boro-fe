import { createSlice, PayloadAction, Reducer } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { ICoordinate } from "../types";

interface UserState {
  name: string;
  email: string;
  facebookId: string;
  accessToken: string;
  picture: string;
  userId: string;
  address: ICoordinate;
}

interface PartialUserState {
  picture: string;
  userId: string;
}

export const initialState: UserState = {
  name: "Guest",
  email: "",
  facebookId: "",
  accessToken: "",
  picture: "",
  userId: "",
  address: { latitude: 0, longitude: 0 },
};

export const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.facebookId = action.payload.facebookId;
      state.accessToken = action.payload.accessToken;
      state.picture = action.payload.picture;
      state.userId = action.payload.userId;
    },
    updatePartialUser: (state, action: PayloadAction<PartialUserState>) => {
      state.picture = action.payload.picture;
      state.userId = action.payload.userId;
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
export const selectUserId = (state: RootState) => state.user.userId;
export const selectEmail = (state: RootState) => state.user.email;
export const selectAddress = (state: RootState) => state.user.address;

export default userSliceReducer;
