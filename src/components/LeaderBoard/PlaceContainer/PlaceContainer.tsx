import React from "react";
import "./PlaceContainer.css";
import { Typography } from "@mui/material";

type Props = {
    place: number;
};

const PlaceContainer = ({ place }: Props) => {
    return (
        <div className="place-container">
            {place === 1 && (
                <img
                    className="place-img-data"
                    src="\src\components\LeaderBoard\PlaceContainer\medal1.png"
                />
            )}
            {place === 2 && (
                <img
                    className="place-img-data"
                    src="\src\components\LeaderBoard\PlaceContainer\medal2.png"
                />
            )}
            {place === 3 && (
                <img
                    className="place-img-data"
                    src="\src\components\LeaderBoard\PlaceContainer\medal3.png"
                />
            )}

            {place >= 4 && (
                <Typography className="place-item">{place}</Typography>
            )}
        </div>
    );
};
export default PlaceContainer;