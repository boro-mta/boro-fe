import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { IUserItem } from "../../types";
import Item from "../Item/Item";
import { useNavigate } from "react-router-dom";

type Props = {
  containerTitle: string;
  items: IUserItem[];
};

const ItemsContainer = ({ containerTitle, items }: Props) => {
  const navigate = useNavigate();

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
        {items &&
          items.length > 0 &&
          items.map((item, i) => (
            <Item
              itemId={""} key={i}
              imgID={(item.imageIds)}
              {...item}
              onClick={() => navigate(`/item/${item.id}`)} />
          ))}
      </Container>
    </Container>
  );
};

export default ItemsContainer;
