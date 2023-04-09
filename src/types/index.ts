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

export interface IUserDetails {
  images: string[];
  name?: string;
  about?: string;
  joined?: string;
  id?: string;
}
