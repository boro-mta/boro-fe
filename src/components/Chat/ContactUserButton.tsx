import SendIcon from "@mui/icons-material/Send";
import { startChat } from "../../api/ChatService";
import { Button } from "@mui/material";

type props = {
  recepientUserId: string;
  templateMessage: string;
  afterSendHandler: () => void | undefined;
};

const ContactUserButton = ({
  recepientUserId,
  templateMessage,
  afterSendHandler,
}: props) => {
  const handleStartChat = () => {
    const openNewChat = async () => {
      await startChat(recepientUserId, templateMessage);
    };
    openNewChat();

    if (afterSendHandler) {
      afterSendHandler();
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={<SendIcon />}
      onClick={handleStartChat}
    >
      Contact user
    </Button>
  );
};

export default ContactUserButton;
