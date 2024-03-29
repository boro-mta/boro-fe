import { IItemImageResponse } from "./IItemImageResponse";

export interface IItemResponse {
  id: string;
  title: string;
  description: string;
  images: IItemImageResponse[];
  ownerId: string | null;
  categories: string[];
  condition: string;
  latitude: number;
  longitude: number;
}
