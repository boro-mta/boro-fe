import { IFullItemDetailsNew } from "../types";
import { IMG_1, IMG_2, IMG_3 } from "./images";

const imgProps = IMG_1.split(",")
export const allItemDetailsNew: IFullItemDetailsNew[] = [
  {
    itemId: "123",
    title: "Working driller for any construction at home",
    categories: ["Home Tools", "Gardening", "Construction"],
    description:
      "Yellow driller with minor scratches on the side, perfect for drilling holes while constructing. Needs to be charged up before used.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere mollis tortor, vitae eleifend risus pretium sit amet. Cras aliquet nulla quis efficitur ultrices. Duis ac posuere est, vel commodo sapien. Maecenas vel arcu condimentum, pharetra mi vitae, mollis tortor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames.",
    condition: "Brand New",
    images: [
      {
        base64ImageData: imgProps[1],
        base64ImageMetaData: imgProps[0],
        imageId: "12345"
      }
    ],
    excludedDates: [new Date(new Date().setDate(new Date().getDate() + 3))],
  },
];
