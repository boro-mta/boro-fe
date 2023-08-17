import React from "react";
import "./MinimizedUserDetails.css";
import { Link } from "react-router-dom";

type Props = {
  profileImg: string;
  fullName: string;
  partyId?: string;
};

const MinimizedUserDetails = ({ profileImg, fullName, partyId }: Props) => {
  const MinimizedUser = () => (
    <div className="minimized-user-container">
      <div className="img-container">
        <img
          className="img-data"
          src={
            profileImg ||
            "https://material-kit-pro-react.devias.io/assets/avatars/avatar-fran-perez.png"
          }
        />
      </div>
      <div className="name-container" title={fullName}>
        {fullName}
      </div>
    </div>
  );
  return (
    <>
      {partyId ? (
        <Link className="link-styles" to={`/users/${partyId}`}>
          <MinimizedUser />
        </Link>
      ) : (
        <MinimizedUser />
      )}
    </>
  );
};

export default MinimizedUserDetails;
