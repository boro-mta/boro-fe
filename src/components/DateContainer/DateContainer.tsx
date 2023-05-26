import React, { useEffect, useState } from "react";
import { getMonthAndDayNumber } from "../../utils/calendarUtils";
import "./dateContainer.css";
import { Typography } from "@mui/material";
type Props = {
  date: Date;
};
const DateContainer = ({ date }: Props) => {
  const [month, setMonth] = useState<string>("");
  const [dayNumber, setDayNumber] = useState<string>("");
  useEffect(() => {
    const formattedDate = getMonthAndDayNumber(date);
    setMonth(formattedDate[0]);
    setDayNumber(formattedDate[1]);
  }, []);
  return (
    <div className="date-container">
      <Typography className="date-item">{month}</Typography>
      <Typography className="date-item">{dayNumber}</Typography>
    </div>
  );
};
export default DateContainer;
