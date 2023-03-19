import React, { useState } from "react";
import DateRangePicker from "../components/DateRangePicker/DateRangePicker";

type Props = {};

const calendarPage = (props: Props) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [message, setMessage] = useState<string>();

  const exampleDate1: Date = new Date("March 21, 2023 02:00:00");
  const exampleDate2: Date = new Date("March 23, 2023 02:00:00");
  const exampleDate3: Date = new Date("March 27, 2023 02:00:00");

  const datesToExcludeArr: Date[] = [exampleDate1, exampleDate2, exampleDate3];

  const handleChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setMessage("");
  };

  const handleSubmit = (startDate: Date, endDate: Date) => {
    checkDatesAreAvailable(startDate, endDate);
  };

  const checkDatesAreAvailable = (startDate: Date, endDate: Date) => {
    let loop: Date = new Date(startDate);
    while (loop <= endDate) {
      if (checkExcludeDatesArrayContainsDate(loop)) {
        setMessage(
          "The date " +
            loop +
            " is not available, please choose different dates."
        );
        break;
      } else {
        setMessage("The dates are available:)");
      }

      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
  };

  const checkExcludeDatesArrayContainsDate = (dateToCheck: Date): boolean => {
    for (let i = 0; i < datesToExcludeArr.length; i++) {
      if (
        dateToCheck.getDate() === datesToExcludeArr[i].getDate() &&
        dateToCheck.getMonth() === datesToExcludeArr[i].getMonth() &&
        dateToCheck.getFullYear() === datesToExcludeArr[i].getFullYear()
      ) {
        return true;
      }
    }

    return false;
  };

  return (
    <>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onSubmit={handleSubmit}
        onChange={handleChange}
        datesToExclude={datesToExcludeArr}
      />
      <p>{startDate.toDateString()}</p>
      <p>{endDate && endDate.toDateString()}</p>
      <p>{message}</p>
    </>
  );
};

export default calendarPage;
