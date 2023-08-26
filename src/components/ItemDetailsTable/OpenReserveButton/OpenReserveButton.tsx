import React from "react";
import { Box } from "@mui/material";
import SouthIcon from '@mui/icons-material/South';
import "./OpenReserveButton.css"

type Props = {
    onClick: () => void;
};

const OpenReserveButton = ({ onClick }: Props) => {
    return (
        <Box
            onClick={onClick}
            style={{ display: "flex", marginTop: "10px", marginBottom: "10px" }}
            sx={{ width: "90px", cursor: "pointer" }}
            className="reserve-button-box"
        >
            <SouthIcon />
            Reserve
        </Box>
    );
};

export default OpenReserveButton;
