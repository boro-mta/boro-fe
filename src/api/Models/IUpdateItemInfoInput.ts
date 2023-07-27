export default interface IUpdateItemInfoInput {
  title: string;
  description?: string | null;
  condition: string;
  categories: string[];
  imagesToRemove: string[] | null;
}
