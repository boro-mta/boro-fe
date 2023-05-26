import React, { useEffect, useState } from "react";
import { getItemsByUser } from "../api/ItemService";
import { useAppSelector } from "../app/hooks";
import { selectUserId } from "../features/UserSlice";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import { IItem, IUserItem } from "../types";
import { getImgById } from "../api/ImageService";

type Props = {};

const myItemsPage = (props: Props) => {
  const [myItems, setMyItems] = useState<IItem[]>([]);
  const userGuid = useAppSelector(selectUserId);

  useEffect(() => {
    const getMyItems = async () => {
      const items = (await getItemsByUser(userGuid)) as IUserItem[];
      if (Array.isArray(items) && items.length > 0) {
        let itemsWithImagesPromises = items.map(async (item, i) => {
          let currObj: IItem = {
            itemId: item.id,
            title: item.title,
          };
          currObj.img = await getImgById(item.imageIds[0]);

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
