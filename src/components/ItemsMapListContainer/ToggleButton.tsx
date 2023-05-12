import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const ToggleButton = styled(Button)(({}) => ({
  borderRadius: "24px",
  backgroundColor: "#222222",
  color: "#ffffff",
  textTransform: "none",
  padding: "14px 19px",
  position: "fixed",
  bottom: "5%",
  left: "50%",
  zIndex: 100,
  transform: "translateX(-50%)",
  "&:hover": {
    backgroundColor: "#222222",
  },
  width: "160px",
}));

export default ToggleButton;
