import { Box, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { IUserItem } from "../../types";
import Item from "../Item/Item";
import { useNavigate } from "react-router-dom";
import AddNewItemBox from "./AddNewItemBox";
import { isLoggedIn } from "../../utils/authUtils";

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
      <Grid
        container
        spacing={{ xs: 1, md: 1 }}
        columns={{ xs: 1, sm: 8, md: 12 }}
      >
        {items.map((item, i) => (
          <Grid item xs={12} sm={4} md={4} key={i}>
            <Item
              itemId={""}
              key={i}
              imgID={item.imageIds}
              {...item}
              onClick={() => navigate(`/item/${item.id}`)}
            />
          </Grid>
        ))}
        <Grid item xs={12} sm={4} md={4}>
          {isLoggedIn() && (
            <Box sx={{ marginBottom: 15 }}>
              <AddNewItemBox />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ItemsContainer;
