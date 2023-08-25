import React from "react";
import "./ScoreContainer.css";
import { Typography } from "@mui/material";

type Props = {
    score: number;
};

const ScoreContainer = ({ score }: Props) => {
    return (
        <div className="leaderBoard-score-container">
            <Typography className="leaderBoard-score-item">{score}</Typography>
        </div>
    );
};
export default ScoreContainer;