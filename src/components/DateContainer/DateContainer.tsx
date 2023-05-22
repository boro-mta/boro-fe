import React, { useEffect, useState } from "react";
import { getDayAndDayNumber } from "../../utils/calendarUtils";
import "./dateContainer.css";
import { Typography } from "@mui/material";

type Props = {
  date: Date;
};

const DateContainer = ({ date }: Props) => {
  const [day, setDay] = useState<string>("");
  const [dayNumber, setDayNumber] = useState<string>("");

  useEffect(() => {
    const formattedDate = getDayAndDayNumber(date);
    setDayNumber(formattedDate[0]);
    setDay(formattedDate[1]);
  }, []);

  return (
    <div className="date-container">
      <Typography className="date-item">{day}</Typography>
      <Typography className="date-item">{dayNumber}</Typography>
    </div>
  );
};

export default DateContainer;
