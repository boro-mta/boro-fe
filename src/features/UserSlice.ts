import { createSlice, PayloadAction, Reducer } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { ICoordinate, IInputImage, IUserDetails } from "../types";
import IUserProfile from "../api/Models/IUserProfile";
import { formatImagesOnRecieve } from "../utils/imagesUtils";

export interface UserState {
  name: string;
  email: string;
  facebookId: string;
  accessToken: string;
  picture: string;
  userId: string;
  serverAddress: ICoordinate;
  currentAddress: ICoordinate;
}

interface PartialUserState {
  picture: string;
  userId: string;
}

interface PictureState {
  picture: string;
}

export const initialState: UserState = {
  name: "Guest",
  email: "",
  facebookId: "",
  accessToken: "",
  picture: "",
  userId: "",
  serverAddress: { latitude: 0, longitude: 0 },
  currentAddress: { latitude: 0, longitude: 0 },
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
      state.picture = action.payload.picture || state.picture;
      state.userId = action.payload.userId;
      state.serverAddress = action.payload.serverAddress;
      state.currentAddress = action.payload.currentAddress;
    },
    updatePartialUser: (state, action: PayloadAction<PartialUserState>) => {
      state.picture = action.payload.picture;
      state.userId = action.payload.userId;
    },
    updateServerAddress: (state, action: PayloadAction<ICoordinate>) => {
      state.serverAddress = action.payload;
    },
    updateCurrentAddress: (state, action: PayloadAction<ICoordinate>) => {
      state.currentAddress = action.payload;
    },
    updateCurrentPicture: (state, action: PayloadAction<PictureState>) => {
      state.picture = action.payload.picture;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    updateFacebookId: (state, action: PayloadAction<string>) => {
      state.facebookId = action.payload;
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setCurrentLocation: (state, { payload }: PayloadAction<ICoordinate>) => {
      state.currentAddress = {
        latitude: payload.latitude,
        longitude: payload.longitude,
      };
    },
    updateUserAfterFetchByToken: (
      state,
      { payload }: PayloadAction<IUserProfile>
    ) => {
      state.email = payload.email;
      state.facebookId = payload.facebookId;
      state.userId = payload.userId;
      state.name = payload.firstName + " " + payload.lastName;
      state.picture =
        formatImagesOnRecieve([payload.image as IInputImage])[0] ||
        state.picture;
      state.serverAddress = {
        longitude: payload.longitude,
        latitude: payload.latitude,
      };
    },
    updateUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    logoutUser: (state) => {
      state.picture = "";
    },
  },
});

// Specify the type of the state that the slice manages
const userSliceReducer = userSlice.reducer as Reducer<UserState>;

// Action creators are generated for each case reducer function
export const {
  updateUser,
  updateUserId,
  logoutUser,
  updatePartialUser,
  updateServerAddress,
  updateCurrentAddress,
  updateCurrentPicture,
  updateAccessToken,
  updateFacebookId,
  updateUserName,
  setCurrentLocation,
  updateUserAfterFetchByToken,
} = userSlice.actions;

export const selectUserName = (state: RootState) => state.user.name;
export const selectPicture = (state: RootState) => state.user.picture;
export const selectUserId = (state: RootState) => state.user.userId;
export const selectEmail = (state: RootState) => state.user.email;
export const selectServerAddress = (state: RootState) =>
  state.user.serverAddress;
export const selectCurrentAddress = (state: RootState) =>
  state.user.currentAddress;
export const selectFacebookId = (state: RootState) => state.user.facebookId;
export const selectAccessToken = (state: RootState) => state.user.accessToken;

export default userSliceReducer;
