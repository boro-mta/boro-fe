import { Button } from "@mui/material";
import React from "react";
import DatePicker from 'react-datepicker'

type Props = {
    startDate: Date;
    endDate: Date;
    onChange: (dates: any) => void;
    datesToExclude: Date[];
};

const DateRangePicker = ({ startDate, endDate, onChange, datesToExclude }: Props) => {

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
        />
    )
}

export default DateRangePicker