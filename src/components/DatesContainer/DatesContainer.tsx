import React from "react";
import "./DatesContainer.css"
import StartDateContainer from "./StartDateContainer/StartDateContainer";
import EndDateContainer from "./EndDateContainer/EndDateConainer";

type Props = {
    startDate: Date;
    endDate: Date;
};

const DatesContainer = ({ startDate, endDate }: Props) => {
    return (
        <div className="dates-container">
            <StartDateContainer startDate={startDate} />
            <EndDateContainer endDate={endDate} />
        </div>
    );
};

export default DatesContainer;
