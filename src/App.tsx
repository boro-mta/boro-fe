import { Box } from "@mui/material";
import React, { useState } from "react";
import DateRangePicker from "./components/DateRangePicker/DateRangePicker";
import ItemsContainer from "./components/ItemsContainer/ItemsContainer";
import { items } from "./mocks/items";

function App() {
  //wrong dates array to DateRangePicker
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const exampleDate1: Date = new Date('April 19, 2023 23:15:30');
  const exampleDate2: Date = new Date('March 12, 2023 23:15:30');
  const exampleDate3: Date = new Date('March 29, 2023 23:15:30');

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

  };

  const checkDatesAreAvailable = (dates: any) => {

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
