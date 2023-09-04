import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import ContactUserButton from "../Chat/ContactUserButton";

type props = {
  userId: string;
  userFullName: string;
  profilePictureData: string | null | undefined;
};

const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

const stringAvatar = (name: string) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
};

const MinimizedUserDetails = ({
  userId,
  userFullName,
  profilePictureData,
}: props) => {
  const navigate = useNavigate();

  const DynamicAvatar = (props: any) => {
    return profilePictureData != undefined && profilePictureData != "" ? (
      <Avatar {...props} alt={userFullName} src={profilePictureData} />
    ) : (
      <Avatar {...props} {...stringAvatar(userFullName)} />
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Link to={`/users/${userId}`} style={{ textDecoration: "none" }}>
        <Paper
          variant="outlined"
          sx={{
            borderRadius: "30px",
            padding: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <DynamicAvatar />
          <Typography sx={{ padding: 1 }} variant="body1">
            {userFullName}
          </Typography>
        </Paper>
      </Link>
    </Box>
  );
};

export default MinimizedUserDetails;
