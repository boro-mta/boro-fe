import React from "react";
import "./minimizedItemDetails.css";
import { Link } from "react-router-dom";

type Props = {
  itemName: string;
  itemCategories: string[];
  itemImg: string;
  itemId: string;
};

const MinimizedItemDetails = ({
  itemName,
  itemCategories,
  itemImg,
  itemId,
}: Props) => {
  return (
    <Link className="link-styles" to={`/item/${itemId}`}>
      <div className="minimized-item-container">
        <div className="img-container">
          <img className="img-data" src={itemImg} />
        </div>
        <div className="data-container">
          <div className="item-name" title={itemName}>
            {itemName}
          </div>
          <div className="item-categories" title={itemCategories.join(", ")}>
            {itemCategories.join(", ")}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MinimizedItemDetails;
