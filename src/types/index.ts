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
  category: string[];
  title: string;
  description?: string;
  images?: string[];
  excludedDates: Date[];
}
