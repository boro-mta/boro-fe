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
import { updateUserAfterFetchByToken } from "../../features/UserSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUserProfile } from "../../api/UserService";
import { getCurrentUserId } from "../../utils/authUtils";
import AppBarMenu from "./AppBarMenu/AppBarMenu";

function ResponsiveAppBar() {
  //Use local storage for user info
  const userName = useAppSelector((state) => state.user.name);
  const profilePicture = useAppSelector((state) => state.user.picture);

  //Navigation tool
  const navigate = useNavigate();

  //Redux dispatcher
  const dispatch = useAppDispatch();
  const userId = getCurrentUserId();
  const getUserDetails = async () => {
    try {
      //Get a certain userProfile by userId
      if (!userId) return;
      const userProfile = await getUserProfile(userId as string);
      if (!userProfile) return;

      dispatch(updateUserAfterFetchByToken(userProfile));
      //Updates all the details in the page to fit the user we received
    } catch (error) {
      console.error(error);
    }
  };

  //If user has info in local storage, retrive it
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
      sx={{ marginBottom: "10px", background: "white" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center", // Vertically center content
              width: "100%", // Adjust width to fit entire app bar
            }}
          >
            <Box
              sx={{
                display: { xs: "flex", md: "flex" },
                alignItems: "center", // Vertically center content
                mr: 1,
              }}
            >
              <img
                src="/assets/logo.png"
                alt="Logo"
                style={{ maxHeight: "80px", width: "auto" }}
              />
            </Box>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Typography variant="h6" sx={{ mr: 1, whiteSpace: "nowrap" }}>
                  {" "}
                  {/* Add whiteSpace property */}
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
              <AppBarMenu afterClick={handleCloseUserMenu} />
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default React.memo(ResponsiveAppBar);
