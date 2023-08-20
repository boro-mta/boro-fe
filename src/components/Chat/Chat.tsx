import "@sendbird/uikit-react/dist/index.css";
import React, { useEffect, useState } from "react";
import DesktopChat from "./DesktopChat/DesktopChat";
import MobileChat from "./MobileChat/MobileChat";
import { useAppSelector } from "../../app/hooks";

type Props = {};

export interface IMinifiedUserDetails {
  profileImg: string;
  fullName: string;
  partyId?: string;
}

const Chat = (props: Props) => {
  const name = useAppSelector((state) => state.user.name);
  const picture = useAppSelector((state) => state.user.picture);
  const userId = useAppSelector((state) => state.user.userId);

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

  return isMobileView ? (
    <MobileChat fullName={name} profileImg={picture} partyId={userId} />
  ) : (
    <DesktopChat fullName={name} profileImg={picture} partyId={userId} />
  );
};

export default Chat;
