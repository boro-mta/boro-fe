import React from "react";
import { Box, Paper, Typography } from "@mui/material";

type props = {
  startDate: Date;
  endDate: Date;
};

const DateRangeSummary = ({ startDate, endDate }: props) => {
  const startDay = startDate.getDate();
  const startMonth = startDate.toLocaleString("default", { month: "short" });
  const startYear = startDate.getFullYear();

  const endDay = endDate.getDate();
  const endMonth = endDate.toLocaleString("default", { month: "short" });
  const endYear = endDate.getFullYear();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width={300}
      margin="20px auto"
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: "20px",
          width: "100px",
          height: "100px",
          backgroundColor: "#007bff",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {startDay}
        </Typography>
        <Typography variant="body1">{startMonth}</Typography>
        <Typography variant="body2">{startYear}</Typography>
      </Paper>
      <Typography variant="h3">➔</Typography>
      <Paper
        elevation={3}
        sx={{
          borderRadius: "20px",
          width: "100px",
          height: "100px",
          backgroundColor: "#007bff",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {endDay}
        </Typography>
        <Typography variant="body1">{endMonth}</Typography>
        <Typography variant="body2">{endYear}</Typography>
      </Paper>
    </Box>
  );
};

export default DateRangeSummary;
