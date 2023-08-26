import SendIcon from "@mui/icons-material/Send";
import { startChat } from "../../api/ChatService";
import { Button, SxProps, Theme } from "@mui/material";

type props = {
  recepientUserId: string;
  templateMessage: string;
  afterSendHandler: () => void | undefined;
  sx?: SxProps<Theme> | undefined;
};

const ContactUserButton = ({
  recepientUserId,
  templateMessage,
  afterSendHandler,
  sx,
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
      sx={{ marginLeft: 1, ...sx }}
    >
      Contact user
    </Button>
  );
};

export default ContactUserButton;
