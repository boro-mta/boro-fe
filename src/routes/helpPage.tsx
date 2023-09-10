import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { updateFacebookId, updateUserId } from "../features/UserSlice";
import { useNavigate } from "react-router";

type Props = {};

const helpPage = (props: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (username: string) => {
    let facebookId = "";
    let beToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYWQwMTU3ZC0xNzZhLTQ1MGYtOWJiMS0yZGVmMTUxZWQyZDUiLCJqdGkiOiIxODI0OTk3ZC1mY2E5LTRkNzUtYjQwMS0wMmVjNzFmMGVjNDMiLCJzYnVpZCI6IjJjMDkyNTIwLTRkNDYtNDM1MS1hY2ZlLTA1YjEyNzZiMmY5MyIsInNiYXQiOiI5NDM2N2FjOGI5MDI5MGNhODBlMjNiY2VlYTIwNjZkOGE2ZTlhODFjIiwiZmJpZCI6IjYyNDMxNjA3OTIzOTQ3MjQiLCJuYW1lIjoiQWxvbl9Eb3JvbiIsImVtYWlsIjoiYWxvbjEyMTIxMUBnbWFpbC5jb20iLCJuYmYiOjE2OTQzMzIxNTUsImV4cCI6MTY5NDQxODU1NSwiaXNzIjoiNUM2MDg4REE1MEFBNEZGRDhFNDk3N0YxNzRBOEM0RDQiLCJhdWQiOiI4MDMxNTEwMzczOTk0OTNGQkQ1RUQyRUExMzU5NTIxNiJ9.tr2-Y-fQiKBJu-M74jpeKVk-o4b-8f_P1dM7pGuGG1g";
    let beUserId = "";

    switch (username) {
      case "Alon D":
        facebookId = "6243160792394724";
        beUserId = "aad0157d-176a-450f-9bb1-2def151ed2d5";
        beToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYWQwMTU3ZC0xNzZhLTQ1MGYtOWJiMS0yZGVmMTUxZWQyZDUiLCJqdGkiOiIxODI0OTk3ZC1mY2E5LTRkNzUtYjQwMS0wMmVjNzFmMGVjNDMiLCJzYnVpZCI6IjJjMDkyNTIwLTRkNDYtNDM1MS1hY2ZlLTA1YjEyNzZiMmY5MyIsInNiYXQiOiI5NDM2N2FjOGI5MDI5MGNhODBlMjNiY2VlYTIwNjZkOGE2ZTlhODFjIiwiZmJpZCI6IjYyNDMxNjA3OTIzOTQ3MjQiLCJuYW1lIjoiQWxvbl9Eb3JvbiIsImVtYWlsIjoiYWxvbjEyMTIxMUBnbWFpbC5jb20iLCJuYmYiOjE2OTQzMzIxNTUsImV4cCI6MTY5NDQxODU1NSwiaXNzIjoiNUM2MDg4REE1MEFBNEZGRDhFNDk3N0YxNzRBOEM0RDQiLCJhdWQiOiI4MDMxNTEwMzczOTk0OTNGQkQ1RUQyRUExMzU5NTIxNiJ9.tr2-Y-fQiKBJu-M74jpeKVk-o4b-8f_P1dM7pGuGG1g";
        break;
      case "Rita":
        facebookId = "6557871367559220";
        beUserId = "0f835f3f-efe2-42bb-804f-2cef6bb6867c";
        break;
      case "Alon M":
        facebookId = "2032801750385221";
        beUserId = "f1d006a3-5c36-480a-9b5f-5c5f9e012bfe";
        break;
      case "Mor":
        facebookId = "2475374195955035";
        beUserId = "76bcd7ac-337d-4802-8100-6f1273db66bb";
        break;
      default:
        facebookId = "6243160792394724";
        beUserId = "aad0157d-176a-450f-9bb1-2def151ed2d5";
        break;
    }
    dispatch(updateFacebookId(facebookId));
    dispatch(updateUserId(beUserId));
    navigate("/");
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Help Page
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          size="large"
          fullWidth
          onClick={() => handleClick("Alon D")}
        >
          Alon D
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          fullWidth
          onClick={() => handleClick("Rita")}
        >
          Rita
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          fullWidth
          onClick={() => handleClick("Alon M")}
        >
          Alon M
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          fullWidth
          onClick={() => handleClick("Mor")}
        >
          Mor
        </Button>
      </Box>
    </Container>
  );
};

export default helpPage;
