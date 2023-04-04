export interface IItem {
  itemId: string;
  title: string;
  img?: string;
}

export interface IExtraIncludedItemProperties {
  title: string;
  isIncluded: boolean;
}

export interface IFullImageDetails {
  base64ImageData: string;
  base64ImageMetaData: string;
  imageId: string;
  isCover: boolean;
}

export interface IFullItemDetails extends Omit<IItem, "img"> {
  images: string[];
  description?: string;
  extraIncludedItems: IExtraIncludedItemProperties[];
  borrowerAddress?: string;
  borrowerPhoneNumber?: string;
}

export interface IFullItemDetailsNew {
  itemId: string;
  condition: string;
  category: string[];
  title: string;
  description?: string;
  coverPhoto: string;
  additionalPhotos?: string[];
}
