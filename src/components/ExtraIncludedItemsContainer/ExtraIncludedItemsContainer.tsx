import { Box } from "@mui/material";
import React from "react";
import { IExtraIncludedItemProperties } from "../../types";
import IconWithText from "../IconWithText/IconWithText";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/Error";

type Props = {
  extraIncludedItems: IExtraIncludedItemProperties[];
};

const ExtraIncludedItemsContainer = ({ extraIncludedItems }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      {extraIncludedItems.map((item, i) => (
        <IconWithText
          key={i}
          icon={
            item.isIncluded ? (
              <CheckCircleRoundedIcon color="success" />
            ) : (
              <ErrorIcon color="error" />
            )
          }
          text={item.title}
        />
      ))}
    </Box>
  );
};

export default ExtraIncludedItemsContainer;
