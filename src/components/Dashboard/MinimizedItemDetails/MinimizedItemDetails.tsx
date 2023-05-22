import React from "react";
import "./minimizedItemDetails.css";
import { Link } from "react-router-dom";

type Props = {
  profileImg: string;
  fullName: string;
  partyId: string;
};

const MinimizedItemDetails = ({ profileImg, fullName, partyId }: Props) => {
  return (
    <div className="minimized-item-container">
      <div className="img-container">
        <img className="img-data" src={profileImg} />
      </div>
      <div className="name-container">
        <Link className="name-data" to={`/users/${partyId}`}>
          {fullName}
        </Link>
      </div>
    </div>
  );
};

export default MinimizedItemDetails;
