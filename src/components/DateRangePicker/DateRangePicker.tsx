import { Button } from "@mui/material";
import React, { useState } from "react";
import DatePicker from 'react-datepicker'
import { start } from "repl";

type Props = {
    startDate: Date;
    endDate: Date;
    onSubmit: (startDate: Date, endDate: Date) => (void);
    onClearDates: () => void;
    onChange: (dates: any) => void;
};

const DateRangePicker = ({ startDate, endDate, onSubmit, onClearDates, onChange }: Props) => {
    return (
        <div>
            <DatePicker
                selected={startDate}
                onChange={onChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange={true}
                inline={true}
                isClearable={true}
            />
            <Button onClick={() => onSubmit(startDate, endDate)}> Submit </Button>
            <Button onClick={onClearDates}> Clear </Button>
        </div>
    )
}

export default DateRangePicker