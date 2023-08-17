import { HttpOperation, requestAsync } from "./BoroWebServiceClient";

export const startChat = async (
  recepientId: string,
  message: string
): Promise<void> => {
  const endpoint = `Chat/Start/With/${recepientId}`;

  await requestAsync<void>(HttpOperation.POST, endpoint, message);
};
