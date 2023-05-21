import React, { useEffect, useState } from "react";
import { getItemsByUser } from "../api/ItemService";
import { useAppSelector } from "../app/hooks";
import { selectGuid } from "../features/UserSlice";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import { IItem } from "../types";
import { getImgById } from "../api/ImageService";

type Props = {};

const myItemsPage = (props: Props) => {
  const [myItems, setMyItems] = useState<IItem[]>([]);
  const userGuid = useAppSelector(selectGuid);

  useEffect(() => {
    const getMyItems = async () => {
      const items = (await getItemsByUser(userGuid)) as IItem[];
      if (Array.isArray(items) && items.length > 0) {
        let itemsWithImagesPromises = items.map(async (item, i) => {
          let currObj: IItem = {
            itemId: item.itemId, // We also have a bug the server returns item.id instead of item.itemId
            title: item.title,
          };
          // TODO When BE returns also imageId or image:
          //   let itemImg = await getImgById(item.itemId);
          //   currObj.img = itemImg;

          return currObj;
        });
        Promise.all(itemsWithImagesPromises)
          .then((items) => setMyItems(items))
          .catch((err) => console.log(err));
      }
    };

    userGuid && getMyItems();
  }, []);

  return (
    <div>
      <ItemsContainer containerTitle="My Items" items={myItems} />
    </div>
  );
};

export default myItemsPage;
