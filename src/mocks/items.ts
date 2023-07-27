import { IItem } from "../types";
import { IMG_1, IMG_2, IMG_3 } from "./images";

export const items: IItem[] = [
  {
    itemId: "123",
    title: "Working driller for any construction at home",
    img: IMG_1,
  },
  {
    itemId: "456",
    title: "Brown ladder",
    img: IMG_2,
  },
  {
    itemId: "789",
    title: "metal hammer with double edges",
    img: IMG_3,
  },
];

export const categoriesOptions: string[] = ['Renovation', 'Gardening', 'Kitchen', 'Gaming', 'Electronics'];

export const conditionOptions = [
  {
    value: 0,
    text: 'New',
  },
  {
    value: 1,
    text: 'Good as New',
  },
  {
    value: 2,
    text: 'Ok',
  },
  {
    value: 3,
    text: 'Working well',
  },
  {
    value: 4,
    text: 'Used',
  },
  {
    value: 5,
    text: 'Well maintained',
  },
];

