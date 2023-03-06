import { IItem } from "../types";
import { IMG_1, IMG_2, IMG_3 } from "./images";

export const items: IItem[] = [
  {
    itemId: "123",
    title: "Working driller for any construction at home",
    description:
      "Yellow driller with minor scratches on the side, perfect for drilling holes while constructing. Needs to be charged up before used.",
    img: IMG_1,
  },
  {
    itemId: "456",
    title: "Brown ladder",
    description:
      "Ladder which is height of 20cm, stretched and that is self-supporting or that may be leaned against a vertical surface such as a wall.",
    img: IMG_2,
  },
  {
    itemId: "789",
    title: "metal hammer with double edges",
    description:
      "A hammer is a tool, most often a hand tool, consisting of a weighted head fixed to a long handle that is swung to deliver an impact to a small area of an object. This can be, for example, to drive nails into wood, to shape metal (as with a forge), or to crush rock. Hammers are used for a wide range of driving, shaping, breaking and non-destructive striking applications.",
    img: IMG_3,
  },
];
