import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { IItem } from "../../types";
import Item from "../Item/Item";

type Props = {
  containerTitle: string;
  items: IItem[];
};

const ItemsContainer = ({ containerTitle, items }: Props) => {
  return (
    <Container>
      <Box>
        <Typography variant="h5" gutterBottom>
          {containerTitle}
        </Typography>
      </Box>
      <Container
        style={{
          paddingLeft: 0,
          display: "flex",
          flexDirection: "row",
          overflowX: "auto",
        }}
      >
        {items.map((item, i) => (
          <Item key={i} {...item} />
        ))}
      </Container>
    </Container>
  );
};

export default ItemsContainer;
