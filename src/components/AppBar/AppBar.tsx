import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router";
import {
  selectPicture,
  selectUserName,
  selectUserId,
  updateUser,
  initialState,
} from "../../features/UserSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useLocalStorage from "../../hooks/useLocalStorage";
import Divider from "@mui/material/Divider";
import { ICoordinate } from "../../types";

function ResponsiveAppBar() {
  //Use local storage for user info
  const [userInfo, setUser] = useLocalStorage("user", "");

  //Navigation tool
  const navigate = useNavigate();

  //Redux dispatcher
  const dispatch = useAppDispatch();

  //If user has info in local storage, retrive it
  React.useEffect(() => {
    if (userInfo != "") {
      const userLocalInfo = JSON.parse(userInfo);
      console.log("Parsed info ", userLocalInfo);
      let location: ICoordinate = { latitude: 0, longitude: 0 };
      if (userLocalInfo.address && userLocalInfo.address.latitude) {
        location.latitude = userLocalInfo.address.latitude;
      }
      if (userLocalInfo.address && userLocalInfo.address.longitude) {
        location.longitude = userLocalInfo.address.longitude;
      }

      dispatch(
        updateUser({
          name: userLocalInfo.name,
          email: userLocalInfo.email,
          facebookId: userLocalInfo.facebookId,
          accessToken: userLocalInfo.accessToken,
          picture: userLocalInfo.picture,
          address: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          userId: userLocalInfo.guid,
        })
      );
    }
  }, []);

  //Get the user's profile picture to show in avatar
  const profilePicture = useAppSelector(selectPicture);

  const pages = ["Home"];
  const settings = ["Log In"];
  const userName = useAppSelector(selectUserName);
  const userGuid = useAppSelector(selectUserId);

  //In case the user is logged in and in redux is not represented as Guest
  //Change the options in the app bar menu
  if (userName != "Guest") {
    settings.pop();

    settings.push("Chats");
    settings.push("Reservations");
    settings.push("divider");
    settings.push("Add Item");
    settings.push("Lender Dashboard");
    settings.push("Borrower Dashboard");
    settings.push("divider");
    settings.push("Profile");
    settings.push("Log Out");
  }

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

  const handleSettingButtonClick = (setting: any) => {
    debugger;
    console.log(`click ${setting}`);
    if (setting === "Log In") {
      navigate("/login");
    }

    if (setting === "Profile") {
      navigate(`/Users/${userGuid}`);
    }

    if (setting === "Borrower Dashboard") {
      navigate("/borrowerDashboard");
    }

    if (setting === "Lender Dashboard") {
      navigate("/lenderDashboard");
    }

    if (setting === "Log Out") {
      //Return the redux to its initial state
      dispatch(updateUser(initialState));

      //Clear every saved data including token and user information
      localStorage.clear();

      //Change the app bar options Guest options
      //First, pop every thing
      for (let i = 0; i < settings.length; i++) {
        settings.pop();
      }

      //Then, add log in
      settings.push("Log In");

      //navigate back to home page
      navigate("/");
      window.location.reload();
    }

    if (setting === "Add Item") {
      navigate("/addItem");
    }

    handleCloseUserMenu();
  };

  return (
    <AppBar position="static" sx={{ marginBottom: "10px" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            BORO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => handleMenuButtonClick(page)}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            BORO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleMenuButtonClick(page)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Typography variant="h6" sx={{ mr: 1 }}>
                  {userName}
                </Typography>
                <Avatar alt="Remy Sharp" src={profilePicture} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
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
              {settings.map((setting, i) => {
                if (setting === "divider") {
                  return <Divider key={i} />;
                }
                return (
                  <MenuItem
                    key={setting}
                    onClick={() => handleSettingButtonClick(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default React.memo(ResponsiveAppBar);
