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
import SearchBar from "../SearchBar/SearchBar";

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

  const [isMobileView, setIsMobileView] = React.useState<boolean>(
    window.innerWidth <= 1024
  );

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AppBar position="static" sx={Styles.appBarStyles}>
      <Container maxWidth="xl" sx={Styles.containerStyles}>
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Box sx={Styles.logoContainerStyles}>
            <Box sx={Styles.logoBoxStyles}>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/`);
                }}
              >
                <Box sx={Styles.logoBoxStyles}>
                  {isMobileView ? (
                    <img
                      src="/assets/mobileLogo.png"
                      alt="Logo"
                      style={{ maxHeight: "50px", width: "auto" }}
                    />
                  ) : (
                    <img
                      src="/assets/logo.png"
                      alt="Logo"
                      style={{ maxHeight: "150px", width: "auto" }}
                    />
                  )}
                </Box>
              </a>
            </Box>
          </Box>

          {/* SearchBar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SearchBar
              containerStyles={{ width: isMobileView ? "160px" : "400px" }}
              isMobileView={isMobileView}
            />
          </Box>
          {/* Name + Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={Styles.avatarButtonStyles}
              >
                <Typography sx={Styles.avatarTypographyStyles}>
                  {isMobileView ? userName.split(" ")[0] : userName}
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
