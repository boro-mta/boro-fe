import { Button } from "@mui/material";
import React from "react";
import DatePicker from 'react-datepicker'

type Props = {
    startDate: Date;
    endDate: Date;
    onSubmit: (startDate: Date, endDate: Date) => (void);
    onChange: (dates: any) => void;
    datesToExclude: Date[];
};

const DateRangePicker = ({ startDate, endDate, onSubmit, onChange, datesToExclude }: Props) => {

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
                excludeDates={datesToExclude}
            />
            <Button onClick={() => onSubmit(startDate, endDate)}> Submit </Button>
        </div>
    )
}

export default DateRangePicker