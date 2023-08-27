import React, { useState } from "react";
import { ChannelList, Channel, ChannelSettings } from "@sendbird/uikit-react";
import MinimizedUserDetails from "../../MinimizedUserDetails/MinimizedUserDetails";
import { GroupChannel } from "@sendbird/chat/groupChannel";
import { IMinifiedUserDetails } from "../Chat";
import "./desktopChat.css";
type Props = {};

const DesktopChat = ({
  fullName,
  profileImg,
  partyId,
}: IMinifiedUserDetails) => {
  const [currentChannel, setCurrentChannel] = useState<GroupChannel>();
  const currentChannelUrl = currentChannel ? currentChannel.url : "";
  const [showSettings, setShowSettings] = useState<boolean>(false);
  let channelChatDiv = Array.from(
    document.getElementsByClassName("channel-chat") as HTMLCollectionOf<
      HTMLElement
    >
  )[0];

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
              {partyId && (
                <MinimizedUserDetails
                  userFullName={fullName}
                  profilePictureData={profileImg}
                  userId={partyId}
                />
              )}
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
