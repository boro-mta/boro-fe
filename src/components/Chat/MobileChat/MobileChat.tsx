import { Channel, ChannelList } from "@sendbird/uikit-react";
import React from "react";
import MinimizedUserDetails from "../../MinimizedUserDetails/MinimizedUserDetails";
import { IMinifiedUserDetails } from "../Chat";
import { GroupChannel } from "@sendbird/chat/groupChannel";
import { useNavigate, useParams } from "react-router";

import "./mobileChat.css";
const MobileChat = ({
  fullName,
  profileImg,
  partyId,
}: IMinifiedUserDetails) => {
  const navigate = useNavigate();
  let { channelId } = useParams<string>();

  const handleChannelPressed = (channel: GroupChannel) => {
    navigate(`${channel.url}`);
  };

  const ChannelListComp = () => (
    <ChannelList
      onChannelSelect={handleChannelPressed}
      disableAutoSelect
      renderHeader={() => (
        <div
          style={{
            borderBottom: "1px solid var(--sendbird-light-onlight-04)",
            paddingBottom: "2px",
          }}
        >
          <div style={{ marginLeft: "15px", marginTop: "10px" }}>
            <MinimizedUserDetails
              fullName={fullName}
              profileImg={profileImg}
              partyId={partyId}
            />
          </div>
        </div>
      )}
    />
  );

  const SingleChannelComp = () => (
    <div className="channel-chat">
      <Channel channelUrl={channelId || ""} />
    </div>
  );
  return (
    <div className="channel-wrap">
      <div className="channel-list">
        {!channelId ? <ChannelListComp /> : <SingleChannelComp />}
      </div>
    </div>
  );
};

export default MobileChat;
