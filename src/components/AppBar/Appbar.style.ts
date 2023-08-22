import { SxProps } from "@mui/system";

export const appBarStyles: SxProps = {
  marginBottom: "10px",
  background: "white",
  height: "70px",
  justifyContent: "center",
};

export const containerStyles: SxProps = {
  maxWidth: "xl",
};

export const logoContainerStyles: SxProps = {
  display: "flex",
  alignItems: "center",
  width: "100%",
};

export const logoBoxStyles: SxProps = {
  display: { xs: "flex", md: "flex" },
  alignItems: "center",
  cursor: "pointer",

  mr: 1,
};

export const avatarButtonStyles: SxProps = {
  p: 0,
};

export const avatarTypographyStyles: SxProps = {
  variant: "h6",
  mr: 1,
  whiteSpace: "nowrap",
};

export const menuStyles: SxProps = {
  mt: "45px",
  ml: "25px",
};
