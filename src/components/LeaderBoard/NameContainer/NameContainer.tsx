import React from "react";
import "./NameContainer.css";
import { Typography } from "@mui/material";

type Props = {
    name: string;
};

const NameContainer = ({ name }: Props) => {
    return (
        <div className="leaderBoard-name-container">
            <Typography className="leaderBoard-name-item">{name}</Typography>
        </div>
    );
};
export default NameContainer;