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

export interface IFullItemDetailsNew {
  itemId: string;
  condition: string;
  categories: string[];
  title: string;
  description?: string;
  images?: IFullImageDetails[];
  excludedDates: Date[];
}
