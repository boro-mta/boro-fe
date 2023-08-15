import React, { useState } from "react";
import { ChannelList, Channel, ChannelSettings } from "@sendbird/uikit-react";
import { GroupChannel } from "@sendbird/chat/groupChannel";
import "./chat.styles.css";
import "@sendbird/uikit-react/dist/index.css";
import ChannelListHeader from "@sendbird/uikit-react/ChannelList/components/ChannelListHeader";

type Props = {};

const Chat = (props: Props) => {
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
        <ChannelList onChannelSelect={setCurrentChannel} />
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

export default Chat;
