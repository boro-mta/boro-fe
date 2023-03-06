export interface IItem {
  itemId: string;
  title: string;
  description?: string;
  img?: string;
}

export interface IFullItemDetails extends IItem {
  images?: string[]
}
