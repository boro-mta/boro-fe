import { Box } from "@mui/material";
import React, { useState } from "react";
import DateRangePicker from "./components/DateRangePicker/DateRangePicker";
import ItemsContainer from "./components/ItemsContainer/ItemsContainer";
import { items } from "./mocks/items";

function App() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const exampleDate1: Date = new Date('April 19, 2023 02:00:00');
  const exampleDate2: Date = new Date('March 12, 2023 02:00:00');
  const exampleDate3: Date = new Date('March 29, 2023 02:00:00');

  const datesToExcludeArr: Date[] = [exampleDate1, exampleDate2, exampleDate3];

  const handleChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleSubmit = (startDate: Date, endDate: Date) => {
    console.log(startDate);
    console.log(endDate);
    console.log('submit pressed');
    checkDatesAreAvailable(startDate, endDate);

  };

  const checkDatesAreAvailable = (startDate: Date, endDate: Date) => {
    // startDate.setUTCHours(0, 0, 0, 0);
    // endDate.setUTCHours(0, 0, 0, 0);
    let loop: Date = new Date(startDate);

    while (loop <= endDate) {
      console.log(loop);
      if (checkExcludeDatesArrayContainsDate(loop)) {
        console.log("The date ", loop, " is not available, please choose different dates.");
      }

      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
  };

  const checkExcludeDatesArrayContainsDate = (dateToCheck: Date): boolean => {
    datesToExcludeArr.forEach(function (dateToExclude) {
      console.log("dateToCheck: ", dateToCheck);
      console.log("dateToExclude: ", dateToExclude);
      console.log("dateToCheck.getDay: ", dateToCheck.getDay());
      console.log("dateToExclude.getDay: ", dateToExclude.getDay());

      console.log("dateToCheck.getMonth: ", dateToCheck.getMonth());
      console.log("dateToExclude.getMonth: ", dateToExclude.getMonth());

      console.log("dateToCheck.getFullYear: ", dateToCheck.getFullYear());
      console.log("dateToExclude.getFullYear: ", dateToExclude.getFullYear());

      if (dateToCheck.getDay === dateToExclude.getDay &&
        dateToCheck.getMonth === dateToExclude.getMonth &&
        dateToCheck.getFullYear === dateToExclude.getFullYear)
        console.log("everything is equal!!!");
      return true;
    })

    return false;
  };

  return (
    <div>
      <Box>
        <ItemsContainer containerTitle="Tools for your home 🏠" items={items} />
      </Box>
      <DateRangePicker startDate={startDate} endDate={endDate} onSubmit={handleSubmit} onChange={handleChange} datesToExclude={datesToExcludeArr} />
      <p>{startDate.toDateString()}</p>
      <p>{endDate && endDate.toDateString()}</p>
    </div>
  );
}

export default App;
