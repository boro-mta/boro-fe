import React from "react";
import DatePicker from "react-datepicker";
import "./dateRangePicker.css";

type Props = {
  startDate: Date;
  endDate: Date;
  onChange: (dates: any) => void;
  datesToExclude: Date[];
  datesToHighlight: Date[];
};

const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  datesToExclude,
  datesToHighlight,
}: Props) => {
  return (
    <DatePicker
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange={true}
      inline={true}
      isClearable={true}
      excludeDates={datesToExclude}
      minDate={new Date()}
      highlightDates={datesToHighlight}
      dayClassName={(date) => {
        if (date.getDate() === startDate.getDate() && !endDate) {
          return "start-date";
        } else if (endDate && date.getDate() === endDate.getDate()) {
          return "end-date";
        }
        return "";
      }}
    />
  );
};

export default DateRangePicker;
