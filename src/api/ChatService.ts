import { HttpOperation, requestAsync } from "./BoroWebServiceClient";

export const sendAnnouncement = async (
  recepientId: string,
  message: string
): Promise<void> => {
  const endpoint = `Chat/Sendbird/Announce/to/${recepientId}`;

  await requestAsync<void>(HttpOperation.POST, endpoint, message);
};
