import { Avatar, Box, Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImagesCarousel from "../components/ImagesCarousel/ImagesCarousel";
import { IUserDetails } from "../types";
import { allUserDetails } from "../mocks/userDetails";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import { items } from "../mocks/items";
import Button from "@mui/material/Button";
import api from "../api/HttpClient"
import { selectPicture } from "../features/UserSlice";
import { useAppSelector } from "../app/hooks";

type IUserDetailsParams = {
    userId: string;
};

type Props = {};

const userPage = (props: Props) => {
    const [userDetails, setUserDetails] = useState<IUserDetails>(
        allUserDetails[3]
    );

    const userProfilePicture = useAppSelector(selectPicture);
    let { userId } = useParams<IUserDetailsParams>();
    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate(`/users/${userId}/edit`);
    }

    const handleHomeClick = () => {
        navigate('/');
    }

    const serverUserProfileEndpoint = `Users/${userId}/Profile`;

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const userDetails = await api.get(serverUserProfileEndpoint);
                setUserDetails(userDetails);
                console.log(userDetails);
            } catch (error) {
                console.error(error);
            }
        };

        getUserProfile();
    }, [userId]);

    const formatDate = (date: string) => {
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        return formattedDate;
    };



    return (
        <Container>
            <Grid container spacing={2} alignItems="center">
                <Grid item>

                    {(
                        <Avatar component="div" style={{ height: "150px", width: "150px" }}>
                            <ImagesCarousel images={[userProfilePicture]} />
                        </Avatar>
                    )}
                </Grid>
                <Grid item>
                    <Typography variant="h5">{'Hi! I am ' + userDetails.firstName + ' ' + userDetails.lastName} </Typography>
                    <Typography variant="subtitle2" style={{ color: "gray" }} gutterBottom>
                        {'A Boro friend since: ' + formatDate(userDetails.dateJoined)}
                    </Typography>
                    <Button variant="outlined" onClick={handleEditClick}>
                        Edit Profile
                    </Button>
                </Grid>
            </Grid>
            <br />
            <Typography variant="h5">{'About:'}</Typography>
            <Typography variant="subtitle2" style={{ color: "gray" }} gutterBottom>
                {userDetails.about}
            </Typography>
            <br />
            <Typography variant="h4">{userDetails.firstName + ' \'s items'}</Typography>
            <Box>
                <ItemsContainer containerTitle="My Tool Kit 🏠" items={items} />
            </Box>
            <Box>
                <ItemsContainer containerTitle="My other Tool Kit 🏠" items={items} />
            </Box>

        </Container>


    );
}

export default userPage;
