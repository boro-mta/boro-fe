export interface IItem {
  itemId: string;
  title: string;
  img?: string;
}

export interface IFullItemDetails extends Omit<IItem, "img"> {
  images: string[];
  description?: string;
  extraIncludedItems: string[];
  borrowerAddress?: string;
  borrowerPhoneNumber?: string;
}
