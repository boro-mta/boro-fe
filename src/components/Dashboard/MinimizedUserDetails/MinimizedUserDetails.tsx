import React from "react";
import "./MinimizedUserDetails.css";
import { Link } from "react-router-dom";

type Props = {
  profileImg: string;
  fullName: string;
  partyId: string;
};

const MinimizedUserDetails = ({ profileImg, fullName, partyId }: Props) => {
  return (
    <Link className="link-styles" to={`/users/${partyId}`}>
      <div className="minimized-user-container">
        <div className="img-container">
          <img className="img-data" src={profileImg} />
        </div>
        <div className="name-container" title={fullName}>
          {fullName}
        </div>
      </div>
    </Link>
  );
};

export default MinimizedUserDetails;
