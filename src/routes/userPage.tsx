import { Avatar, Box, Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImagesCarousel from "../components/ImagesCarousel/ImagesCarousel";
import { IInputImage, IUserDetails, IUserItem } from "../types";
import { allUserDetails } from "../mocks/userDetails";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import Button from "@mui/material/Button";
import { getUserProfile } from "../api/UserService";
import { getCurrentUserId } from "../utils/authUtils";
import { formatImagesOnRecieve } from "../utils/imagesUtils";

type Props = {};

const userPage = (props: Props) => {
    const [userDetails, setUserDetails] = useState<IUserDetails>(
        allUserDetails[3]
    );

    const [userItems, setUserItems] = useState<IUserItem[]>([]);

    //Gets the user's Id, Consider deleting
    const userCurrentId = getCurrentUserId();

    //A boolean object defining wether the user owns the current profile
    const [isOwner, setIsOwner] = useState(false);

    //Get the profile picture of the user from redux
    const [userProfilePicture, setUserProfilePicture] = useState("");

    //Get the current url
    const currentUrl = window.location.href;
    //The userId of the profile currently being watched
    let userId = currentUrl.split('/').pop() as string;//useParams<IUserDetailsParams>();
    console.log("current profile user id is : ", userId);

    //Navigation tool
    const navigate = useNavigate();

    //Navigate to user's edit page
    const handleEditClick = () => {
        //A check to see wether the user currently watching is the owner or not
        navigate(`/users/${userId}/edit`);
    }

    //Unused, consider deleting
    const handleHomeClick = () => {
        navigate('/');
    }

    //A function for getting user's details form the server.
    const getUserDetails = async () => {
        try {
            console.log("Getting user profile: ", userId, " from the server");

            //Get a certain userProfile by userId
            const userProfile = await getUserProfile(userId as string);
            console.log("Got a user: ");
            console.log(userProfile);

            //Fit all the details into userDetails
            let userDetails: IUserDetails = {
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                userId: userProfile.facebookId,
                profileImage: formatImagesOnRecieve([userProfile.image as IInputImage])[0],
                dateJoined: userProfile.dateJoined,
                longitude: 0,
                latitude: 0,
                about: userProfile.about,
            };
            setUserProfilePicture(userDetails.profileImage);
            //Check wether the profile currently watched is owned by the user.
            let isOwner = (userCurrentId == userId)

            //Set the state of isOwner
            setIsOwner(!isOwner);

            //If the user is watching his own profile, set the image to be the user's image
            if (isOwner) {
                userDetails.profileImage = userProfilePicture;
            }

            //Updates all the details in the page to fit the user we received
            setUserDetails(userDetails);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, [userId]);

    //A function for formatting dates
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
                    {!isOwner && <Button variant="outlined" disabled={isOwner} onClick={handleEditClick}>
                        Edit Profile
                    </Button>}
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
                <ItemsContainer containerTitle="" items={userItems} />
            </Box>
        </Container>


    );
}

export default userPage;