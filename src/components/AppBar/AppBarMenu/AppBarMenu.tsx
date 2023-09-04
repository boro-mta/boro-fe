import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChatIcon from "@mui/icons-material/Chat";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  updateUser,
  initialState,
  logoutUser,
} from "../../../features/UserSlice";
import { Box } from "@mui/system";
import { Divider, MenuList } from "@mui/material";
import AppBarMenuItem from "./AppBarMenuItem";

type Props = {
  afterClick: () => void;
};

export interface IMenuItem {
  title: string;
  icon: JSX.Element;
  onItemSelect: () => void;
}

interface IDivider {
  isDivider: boolean;
}

const AppBarMenu = ({ afterClick }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.userId);

  const userMenuItems: (IMenuItem | IDivider)[] = [
    {
      title: "Add Item",
      icon: <AddCircleOutlineIcon />,
      onItemSelect: () => navigate("/addItem"),
    },
    {
      title: "Chats",
      icon: <ChatIcon />,
      onItemSelect: () => navigate("/chat"),
    },
    {
      title: "Leaderboard",
      icon: <WorkspacePremiumIcon />,
      onItemSelect: () => navigate("/leaderBoard"),
    },
    {
      isDivider: true,
    },
    {
      title: "My Lendings",
      icon: <VolunteerActivismIcon />,
      onItemSelect: () => navigate("/lenderDashboard"),
    },
    {
      title: "My Borrowings",
      icon: <AutoAwesomeIcon />,
      onItemSelect: () => navigate("/borrowerDashboard"),
    },
    {
      isDivider: true,
    },
    {
      title: "Profile",
      icon: <PersonOutlineIcon />,
      onItemSelect: () => navigate(`/Users/${userId}`, {
        state: {
          snackBarState: false,
          snackBarMessage: "",
        },
      }),
    },
    {
      title: "Log Out",
      icon: <LogoutIcon />,
      onItemSelect: () => {
        dispatch(updateUser(initialState));
        dispatch(logoutUser());
        localStorage.clear();
        navigate(`/`);
      },
    },
  ];

  const guestMenuItems: IMenuItem[] = [
    {
      title: "Log In",
      icon: <LoginIcon />,
      onItemSelect: () => navigate("/login"),
    },
  ];

  const renderMenu = () => {
    const menuToRender = userId ? userMenuItems : guestMenuItems;

    return (
      <MenuList>
        {menuToRender.map((menuItem, i) =>
          "isDivider" in menuItem ? (
            <Divider key={i} sx={{ marginY: "7px" }} />
          ) : (
            <Box sx={{ cursor: "pointer" }} key={menuItem.title}>
              <AppBarMenuItem
                title={menuItem.title}
                icon={menuItem.icon}
                onItemSelect={() => {
                  menuItem.onItemSelect();
                  afterClick();
                }}
              />
            </Box>
          )
        )}
      </MenuList>
    );
  };

  return <Box sx={{ width: "220px" }}>{renderMenu()}</Box>;
};

export default AppBarMenu;
