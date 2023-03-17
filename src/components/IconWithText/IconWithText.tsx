import { Box, Typography } from "@mui/material";
import React from "react";

type Props = {
  icon: JSX.Element;
  text: string;
};

const IconWithText = ({ icon, text }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flex: "50%",
      }}
    >
      {icon}
      <Typography variant="body1" gutterBottom>
        {text}
      </Typography>
    </Box>
  );
};

export default IconWithText;
