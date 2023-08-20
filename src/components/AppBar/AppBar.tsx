import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { updateUserAfterFetchByToken } from "../../features/UserSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUserProfile } from "../../api/UserService";
import { getCurrentUserId } from "../../utils/authUtils";
import AppBarMenu from "./AppBarMenu/AppBarMenu";
import * as Styles from "./Appbar.style";

function ResponsiveAppBar() {
  const userName = useAppSelector((state) => state.user.name);
  const profilePicture = useAppSelector((state) => state.user.picture);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userId = getCurrentUserId();

  const getUserDetails = async () => {
    try {
      if (!userId) return;
      const userProfile = await getUserProfile(userId as string);
      if (!userProfile) return;

      dispatch(updateUserAfterFetchByToken(userProfile));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    getUserDetails();
  }, [userId]);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={Styles.appBarStyles}>
      <Container maxWidth="xl" sx={Styles.containerStyles}>
        <Toolbar disableGutters>
          <Box onClick={() => navigate("/")} sx={Styles.logoContainerStyles}>
            <Box sx={Styles.logoBoxStyles}>
              <img
                src="/assets/logo.png"
                alt="Logo"
                style={{ maxHeight: "150px", width: "auto" }}
              />
            </Box>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={Styles.avatarButtonStyles}
              >
                <Typography sx={Styles.avatarTypographyStyles}>
                  {userName}
                </Typography>
                <Avatar
                  alt="Remy Sharp"
                  src={
                    profilePicture ||
                    "https://material-kit-pro-react.devias.io/assets/avatars/avatar-fran-perez.png"
                  }
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={Styles.menuStyles}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <AppBarMenu afterClick={handleCloseUserMenu} />
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default React.memo(ResponsiveAppBar);
