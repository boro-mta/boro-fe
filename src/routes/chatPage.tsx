import React, { useEffect, useState } from "react";
import {
  ISendBirdCredentials,
  getSendbirdInfoFromToken,
} from "../utils/authUtils";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import Chat from "../components/Chat/Chat";
import { useAppSelector } from "../app/hooks";

type Props = {};

const chatPage = (props: Props) => {
  const [sendbirdCredentials, setSendbirdCredentials] = useState<
    ISendBirdCredentials
  >();

  const name = useAppSelector((state) => state.user.name);

  useEffect(() => {
    let credentials = getSendbirdInfoFromToken();
    if (credentials) {
      setSendbirdCredentials(credentials);
    }
  }, []);
  return (
    <>
      {sendbirdCredentials && (
        <SendbirdProvider
          appId={"BC35F027-AEE4-49FA-8776-D780A16EC23C"}
          userId={sendbirdCredentials.userId}
          accessToken={sendbirdCredentials.accessToken}
          nickname={name}
        >
          <Chat />
        </SendbirdProvider>
      )}
    </>
  );
};

export default chatPage;
