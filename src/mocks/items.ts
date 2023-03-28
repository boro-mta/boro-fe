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

export const options = [
  {
    value: 0,
    text: 'Renovation',
  },
  {
    value: 1,
    text: 'Gardening',
  },
  {
    value: 2,
    text: 'Kitchen',
  },
  {
    value: 3,
    text: 'Gaming',
  },
  {
    value: 4,
    text: 'Electronics',
  },
];
