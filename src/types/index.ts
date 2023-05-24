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

export interface ICoordinate {
  latitude: number;
  longitude: number;
}

export interface ICoordinateRadius extends ICoordinate {
  radiusInMeters: number;
}

export interface IInputItem extends ICoordinate {
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

export interface IMarkerDetails extends ICoordinate {
  id: string;
  title: string;
  imageIds: string[];
}

export enum ReservationStatus {
  Canceled = 10,
  Returned = 20,
  Declined = 30,
  Pending = 40,
  Approved = 50,
  Borrowed = 60,
}

export interface IReservationRow {
  reservationId: string;
  itemTitle: string;
  itemId: string;
  itemImg: string;
  itemDescription: string;
  startDate: Date;
  endDate: Date;
  status: ReservationStatus;
  partyName: string;
  partyImg: string;
  partyId: string;
}

export interface IReservation {
  reservationId: string;
  itemId: string;
  borrowerId: string;
  lenderId: string;
  startDate: string;
  endDate: Date;
  status: number;
}
