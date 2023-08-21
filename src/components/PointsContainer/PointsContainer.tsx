import React from "react";
import "./PointsContainer.css";
import { Typography } from "@mui/material";

type Props = {
    title: string,
    points: number;
};

const PointsContainer = ({ points, title }: Props) => {
    return (
        <div className="points-container">
            <img
                className="points-img-data"
                src="\src\components\PointsContainer\3883695-200.png"
            />
            <Typography className="points-item">{title}</Typography>
            <Typography className="points-item">{points}</Typography>
            <img
                className="points-img-data"
                src="\src\components\PointsContainer\Star_icon_stylized.svg.png"
            />

        </div>
    );
};
export default PointsContainer;