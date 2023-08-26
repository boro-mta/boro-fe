import React from "react";
import "./StartDateContainer.css"

type Props = {
    startDate: Date;
};

const StartDateContainer = ({ startDate }: Props) => {
    return (
        <div className="start-date-container">
            <div style={{ fontWeight: 700 }}>
                Start Date:
            </div>
            <div>
                {startDate.toDateString()}
            </div>
        </div>
    );
};

export default StartDateContainer;
