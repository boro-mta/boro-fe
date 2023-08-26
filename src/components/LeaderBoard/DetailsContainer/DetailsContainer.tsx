import React from "react";
import "./DetailsContainer.css";
import { Typography } from "@mui/material";

type Props = {
    details: number;
};

const DetailsContainer = ({ details }: Props) => {
    return (
        <div className="leaderBoard-details-container">
            <Typography className="leaderBoard-details-item">{details}</Typography>
        </div>
    );
};
export default DetailsContainer;