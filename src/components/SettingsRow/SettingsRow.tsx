import { Box } from '@mui/system'
import React from 'react'
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Typography } from '@mui/material';

type Props = {
    leftIcon: JSX.Element;
    rowText: string;
    onClick: () => void;
}

const SettingsRow = ({ leftIcon, rowText, onClick }: Props) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                marginTop: "10px",
                justifyContent: "space-between",
            }}
            onClick={onClick}
        >
            <Box sx={{ display: "flex" }}>
                {leftIcon}
                <Typography sx={{ marginLeft: "5px" }} variant="body1">
                    {rowText}
                </Typography>
            </Box>
            <ArrowForwardIosIcon />
        </Box>
    )
}

export default SettingsRow