import React from "react";
import { IMenuItem } from "./AppBarMenu";
import { Box, ListItemIcon, ListItemText, MenuItem } from "@mui/material";

const AppBarMenuItem = ({ title, icon, onItemSelect }: IMenuItem) => {
  return (
    <Box onClick={onItemSelect}>
      <MenuItem>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{title}</ListItemText>
      </MenuItem>
    </Box>
  );
};

export default AppBarMenuItem;
