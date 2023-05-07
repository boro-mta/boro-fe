export interface IItem {
  itemId: string;
  title: string;
  img?: string;
}

export interface IFullImageDetails {
  base64ImageData: string;
  base64ImageMetaData: string;
  imageId: string;
}

export interface IInputImage {
  //image type to send to backend
  base64ImageData: string;
  base64ImageMetaData: string;
}

export interface IFullItemDetailsNew {
  itemId: string;
  condition: string;
  categories: string[];
  title: string;
  description: string;
  images?: IInputImage[];
  excludedDates: Date[];
}

export interface IInputItem {
  //item type to send to backend
  title: string;
  description: string;
  condition: string;
  categories: string[];
  images?: IInputImage[];
}

export interface IUserDetails {
  userId: string;
  profileImage: string;
  firstName: string;
  lastName: string;
  about?: string;
  dateJoined: string;
  email?: string;
  latitude: number;
  longitude: number;
}

export interface ICoordinate {
  latitude: number;
  longitude: number;
}

export interface IMarkerDetails extends ICoordinate {
  id: string;
  title: string;
  imageIds: string[];
}
