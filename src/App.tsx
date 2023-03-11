import { Box, TextareaAutosize, TextField } from "@mui/material";
import React, { useState } from "react";
import DateRangePicker from "./components/DateRangePicker/DateRangePicker";
import ItemsContainer from "./components/ItemsContainer/ItemsContainer";
import { items } from "./mocks/items";

function App() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handleChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  // get input of 2 dates
  const handleSubmit = (startDate: Date, endDate: Date) => {
    console.log(startDate);
    console.log(endDate);
    console.log('submit pressed');
  }

  const handleClearDates = () => {
    console.log('clear pressed');
    setStartDate(new Date());
    setEndDate(new Date());
  }

  return (
    <div>
      <Box>
        <ItemsContainer containerTitle="Tools for your home 🏠" items={items} />
      </Box>
      <DateRangePicker startDate={startDate} endDate={endDate} onSubmit={handleSubmit} onClearDates={handleClearDates}
        onChange={handleChange} />
      <p>{startDate.toDateString()}</p>
      <p>{endDate && endDate.toDateString()}</p>
    </div>
  );
}

export default App;
