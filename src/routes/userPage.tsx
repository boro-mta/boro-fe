import { Avatar, Box, CardMedia, Container, Divider, Grid, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImagesCarousel from "../components/ImagesCarousel/ImagesCarousel";
import { IUserDetails } from "../types";
import { allUserDetails } from "../mocks/userDetails";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import { items } from "../mocks/items";

type IUserDetailsParams = {
    userId: string;
};

type Props = {};

const userPage = (props: Props) => {
    const [userDetails, setUserDetails] = useState<IUserDetails>(
        allUserDetails[2]
    );

    let { userId } = useParams<IUserDetailsParams>();


    useEffect(() => {
        // TODO Fetch from API here according to the itemId, for now we mock the data
        const fullDetails =
            allUserDetails.find((user) => user.id === userId) ||
            allUserDetails[0];
        setUserDetails(fullDetails);
    }, []);




    return (
        <Container>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Card sx={{ marginBottom: "20px" }}>
                        {userDetails.images && (
                            <Avatar component="div" style={{ height: "150px", width: "150px" }}>
                                <ImagesCarousel images={userDetails.images} />
                            </Avatar>
                        )}
                    </Card>
                </Grid>
                <Grid item>
                    <Typography variant="h4">{'Hi! I am ' + userDetails.name} </Typography>
                    <Typography variant="subtitle2" style={{ color: "gray" }} gutterBottom>
                        {'A Boro friend since: ' + userDetails.joined}
                    </Typography>
                </Grid>
            </Grid>
            <br />
            <Typography variant="h5">{'About:'}</Typography>
            <Typography variant="subtitle2" style={{ color: "gray" }} gutterBottom>
                {userDetails.about}
            </Typography>
            <br />
            <Typography variant="h4">{userDetails.name + ' \'s items'}</Typography>
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
