import { Paper, ButtonBase, Box, Typography, styled } from "@mui/material";

type props = {
  onClick: () => void;
  imageData: string | undefined;
  itemTitle: string;
  itemDescription: string;
};

const MinimalItemInfoContainer = ({
  onClick,
  imageData,
  itemTitle,
  itemDescription,
}: props) => {
  const Img = styled("img")({
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  });

  return (
    <Paper
      sx={{
        p: 2,
        margin: "auto",
        marginBottom: 1,
        maxWidth: 500,
        maxHeight: 150,
        flexGrow: 1,
        display: "flex",
        gap: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
      }}
    >
      <ButtonBase
        onClick={onClick}
        sx={{
          maxWidth: 128,
          maxHeight: 128,
        }}
      >
        {imageData != "" && <Img alt="complex" src={imageData} />}
      </ButtonBase>
      <Box>
        <Typography gutterBottom variant="h5">
          {itemTitle}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {itemDescription}
        </Typography>
      </Box>
    </Paper>
  );
};

export default MinimalItemInfoContainer;
