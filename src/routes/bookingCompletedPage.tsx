import React, { useState, useRef, useEffect } from "react";
import { Container } from "@mui/system";
import { Button, Typography, Divider, Card, CardMedia } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router";
import { IFullItemDetailsNew } from "../types";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import { getItem } from "../api/ItemService";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

type IFullItemDetailsParams = {
  itemId: string;
};

type Props = {
  startDate: Date;
  endDate: Date;
  onChange: (dates: any) => void;
  datesToExclude: Date[];
};

interface IRowData {
  key: string;
  value: string;
}

interface ITableData {
  tableData: IRowData[];
}

const Row = ({ tableData }: ITableData) => {
  return (
    <div>
      {tableData.map((row, i) => (
        <div key={i}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Typography
              variant="body1"
              sx={{ flexBasis: "50%", color: "darkgray" }}
            >
              {row.key}
            </Typography>
            <Typography variant="body1" sx={{ flexBasis: "50%" }}>
              {row.value}
            </Typography>
          </div>
          {i < tableData.length - 1 && <Divider sx={{ margin: "5px" }} />}
        </div>
      ))}
    </div>
  );
};

const BookingCompletedPage = ({
  startDate,
  endDate,
  datesToExclude,
  onChange,
}: Props) => {
  const { state } = useLocation();
  const {
    selectedStartDate,
    selectedEndDate,
    excludedDates,
    onDateChange,
  } = state;

  const navigate = useNavigate();

  let { itemId } = useParams<IFullItemDetailsParams>();

  const [itemDetails, setItemDetails] = useState<IFullItemDetailsNew>({
    categories: [],
    condition: "",
    itemId: "",
    title: "",
    images: [],
    description: "",
    excludedDates: [],
  });

  const [serverRequestError, setServerRequestError] = useState<any>();

  useEffect(() => {
    const getFullDetails = async () => {
      let fullDetails: IFullItemDetailsNew;
      if (itemId) {
        try {
          fullDetails = (await getItem(itemId)) as IFullItemDetailsNew;
          setItemDetails(fullDetails);
        } catch (err) {
          console.log("Error while loading item");
          setServerRequestError(err);
          //todo:show error
        }
      }
    };
    getFullDetails();
  }, []);

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
        Booking Request is Completed
      </Typography>


      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item>
              <Typography component={"span"} variant="h6">
                Veriffication Pending
              </Typography>
              <Typography variant="body1">
                The lender will review your booking request, come back later for updates!
              </Typography>
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
                <Typography variant="body1">Pending</Typography>
                {/* todo: change to real status */}
              </div>
            </Item>
          </Grid>
          <Grid item xs={5}>
            <Item>
              <Typography variant="h6">
                {selectedStartDate.toDateString()}
              </Typography>
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
              <Typography variant="h6">
                {selectedEndDate.toDateString()}
              </Typography>
            </Item>
          </Grid>
        </Grid>
      </Box>

      <Button
        variant="contained"
        sx={{ mt: 1, mr: 1 }}
        onClick={() => navigate(`/item/${itemId}`)} //todo: change back to all items?
      >
        Back
      </Button>
    </Container>
  );
};

export default BookingCompletedPage;
