import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

interface ToggleButtonProps {
  position?: "top" | "bottom";
}

const ToggleButton = styled(Button)(
  ({ position = "bottom" }: ToggleButtonProps) => ({
    borderRadius: "24px",
    backgroundColor: "#222222",
    color: "#ffffff",
    textTransform: "none",
    padding: "14px 19px",
    position: "fixed",
    zIndex: 100,
    width: "auto",
    minWidth: "160px",
    transform: "translateX(-50%)",
    left: "50%",
    [position]: "5%",
    "&:hover": {
      backgroundColor: "#222222",
    },
  })
);

export default ToggleButton;
