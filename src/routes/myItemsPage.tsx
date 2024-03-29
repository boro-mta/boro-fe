import React, { useEffect, useState } from "react";
import { getUserItems } from "../api/ItemService";
import { useAppSelector } from "../app/hooks";
import { selectUserId } from "../features/UserSlice";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import { IUserItem } from "../types";
import { getImage } from "../api/ImageService";

type Props = {};

const myItemsPage = (props: Props) => {
  const [myItems, setMyItems] = useState<IUserItem[]>([]);
  const userGuid = useAppSelector(selectUserId);

  useEffect(() => {
    const getMyItems = async () => {
      const items = (await getUserItems(userGuid)) as IUserItem[];
      if (Array.isArray(items) && items.length > 0) {
        let itemsWithImagesPromises = items.map(async (item, i) => {
          let currObj: IUserItem = {
            id: item.id,
            title: item.title,
            imageIds: []
          };
          currObj.imageIds[0] = await getImage(item.imageIds[0]);

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
