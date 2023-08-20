import React, { useState, useEffect } from "react";
import { ChannelList, Channel, ChannelSettings } from "@sendbird/uikit-react";
import MinimizedUserDetails from "../../Dashboard/MinimizedUserDetails/MinimizedUserDetails";
import { useAppSelector } from "../../../app/hooks";
import { GroupChannel } from "@sendbird/chat/groupChannel";

type Props = {};

const DesktopChat = (props: Props) => {
  const [currentChannel, setCurrentChannel] = useState<GroupChannel>();
  const currentChannelUrl = currentChannel ? currentChannel.url : "";
  const [showSettings, setShowSettings] = useState<boolean>(false);
  let channelChatDiv = Array.from(
    document.getElementsByClassName("channel-chat") as HTMLCollectionOf<
      HTMLElement
    >
  )[0];

  const name = useAppSelector((state) => state.user.name);
  const picture = useAppSelector((state) => state.user.picture);
  const userId = useAppSelector((state) => state.user.userId);
  const renderSettingsBar = () => {
    channelChatDiv.style.width = "70%";
    channelChatDiv.style.cssFloat = "left";
  };

  const hideSettingsBar = () => {
    channelChatDiv.style.width = "76%";
    channelChatDiv.style.cssFloat = "right";
  };

  return (
    <div className="channel-wrap">
      <div className="channel-list">
        <ChannelList
          onChannelSelect={setCurrentChannel}
          renderHeader={() => (
            <div style={{ marginLeft: "15px" }}>
              <MinimizedUserDetails
                fullName={name === "Guest" ? "Me" : name}
                profileImg={picture}
                partyId={userId}
              />
            </div>
          )}
        />
      </div>
      <div className="channel-chat">
        <Channel
          channelUrl={currentChannelUrl}
          onChatHeaderActionClick={() => {
            setShowSettings(!showSettings);
            renderSettingsBar();
          }}
        />
      </div>
      {showSettings && (
        <>
          <div className="channel-settings">
            <ChannelSettings
              channelUrl={currentChannelUrl}
              onCloseClick={() => {
                setShowSettings(false);
                hideSettingsBar();
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DesktopChat;
