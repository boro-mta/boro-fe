import React from "react";
import "./EmptyDashboardContainer.css"
import { Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router";

type Props = {
    backgroundImg: string
    buttonImg: string
    navigateAddress: string;
    generalText: string;
    linkText: string;
};

const EmptyDashboardContainer = ({ backgroundImg, buttonImg, navigateAddress, generalText, linkText }: Props) => {
    const navigate = useNavigate();

    return (
        <Container className="empty-dashboard-img-container">
            <div style={{ display: "flex", flexDirection: "column" }} className="empty-dashboard-img-div">
                <img
                    className="empty-dashboard-img"
                    src={backgroundImg}
                />

                <Typography variant="h6" gutterBottom style={{ margin: "10px 0px" }}>
                    {generalText}
                </Typography>
                <Typography variant="h6">
                    {linkText}
                </Typography>
            </div>
            <Box
                onClick={() => { navigate(navigateAddress); }}
                style={{ display: "flex", marginTop: "10px", marginBottom: "10px" }}
                sx={{ cursor: "pointer" }}
                className="empty-dashboard-button-box"
            >
                <img
                    className="empty-dashboard-img-button"
                    src={buttonImg}
                />
            </Box>
        </Container>
    );
};

export default EmptyDashboardContainer;