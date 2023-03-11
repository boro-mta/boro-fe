export interface IItem {
  itemId: string;
  title: string;
  img?: string;
}

interface IExtraIncludedItemProperties {
  title: string;
  isIncluded: boolean;
}

export interface IFullItemDetails extends Omit<IItem, "img"> {
  images: string[];
  description?: string;
  extraIncludedItems: IExtraIncludedItemProperties[];
  borrowerAddress?: string;
  borrowerPhoneNumber?: string;
}
