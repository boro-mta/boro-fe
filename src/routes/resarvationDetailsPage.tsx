import React, { useState, useRef, useEffect } from "react";
import { Container } from "@mui/system";
import { Button, Typography, Divider, Card, CardMedia } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router";
import { IFullItemDetailsNew, IReservationDetails, IUserDetails } from "../types";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import { getItem } from "../api/ItemService";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { approveReservation, cancelReservation, declineReservation, getReservation } from "../api/ReservationService";
import { getUserProfile } from "../api/UserService";
import DateContainer from "../components/DateContainer/DateContainer";
import { getCurrentUserId } from "../utils/authUtils";
import IUserProfile from "../api/Models/IUserProfile";

type IReservationDetailsParams = {
    reservationId: string;
};

type Props = {};

const ReservationDetailsPage = (props: Props) => {
    const [reservationDetails, setReservationDetails] = useState<IReservationDetails>({
        reservationId: "",
        itemId: "",
        borrowerId: "",
        lenderId: "",
        startDate: "",
        endDate: "",
        status: 0,
    });

    const [itemDetails, setItemDetails] = useState<IFullItemDetailsNew>({
        categories: [],
        condition: "",
        itemId: "",
        title: "",
        images: [],
        description: "",
        excludedDates: [],
    });

    const [relevantPersonDetails, setRelevantPersonDetails] = useState<IUserProfile>({
        firstName: "",
        lastName: "",
        facebookId: "",
        userId: "",
        email: "",
        image:
        {
            base64ImageData: "",
            base64ImageMetaData: ""
        },
        dateJoined: "",
        longitude: 0,
        latitude: 0,
        about: ""
    });

    let { reservationId } = useParams<IReservationDetailsParams>();

    const [serverRequestError, setServerRequestError] = useState<any>();
    const [otherPerson, setOtherPerson] = useState<boolean>();
    const [userId, serUserId] = useState<string>();
    const [isLender, setIsLender] = useState<boolean>();

    let itemServerDetails: IFullItemDetailsNew;
    let personServerDetails: any;
    let serverUserId: string | null;

    useEffect(() => {
        const getReservationDetails = async () => {
            let reservationDetails: IReservationDetails;
            if (reservationId) {
                try {
                    reservationDetails = (await getReservation(reservationId)) as IReservationDetails;
                    setReservationDetails(reservationDetails);
                    const reservationItemId = reservationDetails.itemId;

                    itemServerDetails = (await getItem(reservationItemId)) as IFullItemDetailsNew;
                    setItemDetails(itemServerDetails);

                    serverUserId = await getCurrentUserId();

                    if (serverUserId === reservationDetails.lenderId) {
                        //this is lender
                        console.log("Lender");
                        setIsLender(true);
                        personServerDetails = await getUserProfile(reservationDetails.borrowerId);
                    }
                    else {
                        //this is borrower
                        console.log("borrower");
                        setIsLender(false);
                        personServerDetails = await getUserProfile(reservationDetails.lenderId);
                    }

                    if (personServerDetails) {
                        setRelevantPersonDetails(personServerDetails);
                    }
                }
                catch (err) {
                    console.log("Error while loading reservation");
                    setServerRequestError(err);
                    //todo:show error
                }
            }
        };

        getReservationDetails();
    }, []);

    console.log(reservationDetails);

    const navigate = useNavigate();

    const handleApprove = async () => {
        if (reservationId) {
            await approveReservation(reservationId);
        }
    };

    const handleDecline = async () => {
        if (reservationId) {
            await declineReservation(reservationId);
        }
    };

    const handleCancel = async () => {
        if (reservationId) {
            await cancelReservation(reservationId);
        }
    };

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'left',
        color: theme.palette.text.secondary,
    }));

    return (
        <Container>
            <Typography component={"span"} variant="h3">
                Reservation Details Page
            </Typography>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    {!isLender && <Grid item xs={12}>
                        <Item>
                            <Typography component={"span"} variant="h6">
                                Veriffication Pending
                            </Typography>
                            <Typography variant="body1">
                                The lender will review your booking request, come back later for updates!
                            </Typography>
                        </Item>
                    </Grid>
                    }
                    {isLender && <Grid item xs={12}>
                        <Item>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}>
                                <Button variant="contained" color="success" onClick={handleApprove}>
                                    Approve
                                </Button>
                                <Button variant="outlined" color="error" onClick={handleDecline}>
                                    Decline
                                </Button>
                            </div>
                        </Item>
                    </Grid>
                    }
                    {!isLender && <Grid item xs={12}>
                        <Item>
                            <Button variant="outlined" color="error" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Item>
                    </Grid>
                    }
                    <Grid item xs={12}>
                        <Item>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    flexDirection: "row",
                                }}
                            >
                                <Card
                                    sx={{ marginBottom: "10px", marginRight: "10px" }}
                                >
                                    {itemDetails.images && (
                                        <CardMedia
                                            component="img"
                                            style={{ height: "130px", width: "130px" }}
                                            image={formatImagesOnRecieve(itemDetails.images)[0]}
                                        ></CardMedia>
                                    )}
                                </Card>

                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <Typography variant="h5">{itemDetails.title}</Typography>
                                    <Typography variant="body1">{itemDetails.description}</Typography>
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                }}
                            >
                                <Typography variant="h6" sx={{ marginRight: "10px" }}>
                                    Request Status:{" "}
                                </Typography>
                                <Typography variant="body1">{reservationDetails.status}</Typography>
                                {/* todo: change to status not by number */}
                            </div>
                        </Item>
                    </Grid>

                    <Grid item xs={12}>
                        <Item>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    flexDirection: "row",
                                }}
                            >
                                <Card
                                    sx={{ marginBottom: "10px", marginRight: "10px" }}
                                >
                                    {itemDetails.images && (
                                        <CardMedia
                                            component="img"
                                            style={{ height: "130px", width: "130px" }}
                                            image={formatImagesOnRecieve(itemDetails.images)[0]} //todo: change to profile picture of borrower 
                                        ></CardMedia>
                                    )}
                                </Card>

                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <Typography variant="h5">{relevantPersonDetails.firstName}</Typography>
                                    <Typography variant="body1">{relevantPersonDetails.lastName}</Typography>
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                }}
                            >
                                {!isLender && <Typography variant="h6" sx={{ marginRight: "10px" }}>
                                    About the lender:{" "}
                                </Typography>
                                }
                                {isLender && <Typography variant="h6" sx={{ marginRight: "10px" }}>
                                    About the borrower:{" "}
                                </Typography>
                                }
                                <Typography variant="body1">{relevantPersonDetails.about}</Typography>
                            </div>
                        </Item>
                    </Grid>

                    <Grid item xs={5}>
                        <Item>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}>
                                <Typography variant="body1">Start Date</Typography>
                                <DateContainer date={new Date(reservationDetails.startDate)} />
                            </div>
                        </Item>
                    </Grid>
                    <Grid item xs={2}>
                        <Item>
                            <Typography textAlign={"center"} variant="h6">
                                {'>'}
                            </Typography>
                        </Item>
                    </Grid>
                    <Grid item xs={5}>
                        <Item>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}>
                                <Typography variant="body1">End Date</Typography>
                                <DateContainer date={new Date(reservationDetails.endDate)} />
                            </div>
                        </Item>
                    </Grid>
                </Grid>
            </Box>

            <Button
                variant="contained"
                sx={{ mt: 1, mr: 1 }}
            // onClick={() => navigate(`/item/${itemId}`)} //todo: change back to all items?
            >
                Back
            </Button>
        </Container>
    );
};

export default ReservationDetailsPage;