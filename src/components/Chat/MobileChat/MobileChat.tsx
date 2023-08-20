import { ChannelList } from "@sendbird/uikit-react";
import React from "react";
import MinimizedUserDetails from "../../Dashboard/MinimizedUserDetails/MinimizedUserDetails";
import { IMinifiedUserDetails } from "../Chat";
import { useNavigate } from "react-router";
import "./mobileChat.css";
const MobileChat = ({
  fullName,
  profileImg,
  partyId,
}: IMinifiedUserDetails) => {
  const navigate = useNavigate();

  return (
    <div className="channel-wrap">
      <div className="channel-list">
        <ChannelList
          onChannelSelect={(channel) => {
            navigate(`/chatWindow/${channel.url}`);
          }}
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
      </div>
    </div>
  );
};

export default MobileChat;
