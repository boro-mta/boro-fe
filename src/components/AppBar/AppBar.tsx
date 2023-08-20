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
  Button,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { Menu as MenuIcon, Adb as AdbIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { updateUserAfterFetchByToken } from "../../features/UserSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUserProfile } from "../../api/UserService";
import { getCurrentUserId } from "../../utils/authUtils";
import AppBarMenu from "./AppBarMenu/AppBarMenu";

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

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuButtonClick = (page: any) => {
    console.log(`click ${page}`);
    if (page === "Home") {
      navigate("/");
      handleCloseNavMenu();
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        marginBottom: "10px",
        background: "white",
        height: "70px",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: { xs: "flex", md: "flex" },
                alignItems: "center",
                mr: 1,
              }}
            >
              <img
                src="/assets/logo.png"
                alt="Logo"
                style={{ maxHeight: "150px", width: "auto" }}
              />
            </Box>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Typography variant="h6" sx={{ mr: 1, whiteSpace: "nowrap" }}>
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
              sx={{ mt: "45px", ml: "25px" }}
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