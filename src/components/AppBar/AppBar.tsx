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
import { ICoordinate, IInputImage, IUserDetails } from "../../types";
import { getUserProfile } from "../../api/UserService";
import { formatImagesOnRecieve } from "../../utils/imagesUtils";
import { useState } from "react";
import { getCurrentUserId } from "../../utils/authUtils";
import { allUserDetails } from "../../mocks/userDetails";

function ResponsiveAppBar() {
  //Use local storage for user info
  const [userInfo, setUser] = useLocalStorage("user", "");
  const [isOwner, setIsOwner] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const userGuid = useAppSelector(selectUserId);
  //Navigation tool
  const navigate = useNavigate();

  //Redux dispatcher
  const dispatch = useAppDispatch();
  const userId = getCurrentUserId();
  const getUserDetails = async () => {
    try {
      console.log("Getting user profile: ", userId, " from the server");

      //Get a certain userProfile by userId
      const userProfile = await getUserProfile(userId as string);
      console.log("Got a user: ");
      console.log(userProfile);

      //Fit all the details into userDetails
      let userDetails: IUserDetails = {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        userId: userProfile.facebookId,
        profileImage: formatImagesOnRecieve([
          userProfile.image as IInputImage,
        ])[0],
        dateJoined: userProfile.dateJoined,
        longitude: 0,
        latitude: 0,
        about: userProfile.about,
      };
      setUserName(userDetails.firstName);
      setProfilePicture(userDetails.profileImage);
      //Check wether the profile currently watched is owned by the user.
      const userCurrentId = getCurrentUserId();
      let isOwner = userCurrentId == userId;

      //Set the state of isOwner
      setIsOwner(!isOwner);

      //If the user is watching his own profile, set the image to be the user's image
      if (isOwner) {
        userDetails.profileImage = profilePicture;
      }

      //Updates all the details in the page to fit the user we received
    } catch (error) {
      console.error(error);
    }
  };

  //If user has info in local storage, retrive it
  React.useEffect(() => {
    getUserDetails();
  }, [userId]);

  //Get the user's profile picture to show in avatar
  const [profilePicture, setProfilePicture] = useState("");

  const pages = ["Home"];
  const settings = ["Log In"];

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
    console.log(`click ${setting}`);
    if (setting === "Log In") {
      navigate("/login");
    }

    if (setting === "Profile") {
      navigate(`/Users/${userId}`);
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
          <Box
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer", display: "flex" }}
          >
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
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
          </Box>
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
