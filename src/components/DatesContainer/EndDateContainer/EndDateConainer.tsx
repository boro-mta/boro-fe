import React from "react";
import "./EndDateContainer.css"

type Props = {
    endDate: Date;
};

const EndDateContainer = ({ endDate }: Props) => {
    return (
        <div className="end-date-container">
            <div style={{ fontWeight: 700 }}>
                End Date:
            </div>
            <div>
                {endDate.toDateString()}
            </div>
        </div>
    );
};

export default EndDateContainer;
