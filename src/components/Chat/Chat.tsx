import "@sendbird/uikit-react/dist/index.css";
import React, { useEffect, useState } from "react";
import { ChannelList, Channel, ChannelSettings } from "@sendbird/uikit-react";
import { GroupChannel } from "@sendbird/chat/groupChannel";
import "./chat.styles.css";
import MinimizedUserDetails from "../Dashboard/MinimizedUserDetails/MinimizedUserDetails";
import { useAppSelector } from "../../app/hooks";
import DesktopChat from "./DesktopChat/DesktopChat";

type Props = {};

const Chat = (props: Props) => {
  const [isMobileView, setIsMobileView] = useState<boolean>(
    window.innerWidth <= 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isMobileView) {
    return <div>Mobile!</div>;
  }

  return isMobileView ? <div>Mobile!</div> : <DesktopChat />;
};

export default Chat;
