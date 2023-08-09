import { IItemImageResponse } from "./IItemImageResponse";

export default interface ISearchResult {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  image: IItemImageResponse;
}
