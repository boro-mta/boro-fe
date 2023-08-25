import React from "react";
import "./PlaceContainer.css";
import { Typography } from "@mui/material";

type Props = {
    place: number;
};

const PlaceContainer = ({ place }: Props) => {
    return (
        <div className="place-container">
            <Typography className="place-item">{place}</Typography>
        </div>
    );
};
export default PlaceContainer;