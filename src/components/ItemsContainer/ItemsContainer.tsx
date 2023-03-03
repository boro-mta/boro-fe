import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { IMG_1, IMG_2 } from "../../mocks/images";
import Item from "../Item/Item";

type Props = {
  containerTitle: string;
};

const ItemsContainer = ({ containerTitle }: Props) => {
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
          flexWrap: "wrap",
        }}
      >
        <Item
          itemId="123"
          title="alon"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Est dicta quam quae vero veniam nesciunt aliquid natus voluptate reprehenderit! Corporis!"
          img={IMG_1}
        />
        <Item
          itemId="123"
          title="alon"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Est dicta quam quae vero veniam nesciunt aliquid natus voluptate reprehenderit! Corporis!"
          img={IMG_2}
        />
        <Item
          itemId="123"
          title="alon"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Est dicta quam quae vero veniam nesciunt aliquid natus voluptate reprehenderit! Corporis!"
        />
      </Container>
    </Container>
  );
};

export default ItemsContainer;
