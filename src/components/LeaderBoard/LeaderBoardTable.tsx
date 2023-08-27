import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { useNavigate } from "react-router";
import { ILeaderBoardRow } from "../../types";
import "./LeaderBoardTable.css";
import PlaceContainer from "./PlaceContainer/PlaceContainer";
import NameContainer from "./NameContainer/NameContainer";
import ScoreContainer from "./ScoreContainer/ScoreContainer";
import { isCurrentUser } from "../../utils/authUtils";
import DetailsContainer from "./DetailsContainer/DetailsContainer";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Box, Container } from "@mui/system";

type Props = {
  rows: ILeaderBoardRow[];
};

const LeaderBoardTable = ({ rows }: Props) => {
  const navigate = useNavigate();

  const getRowClassName = (userId: string): string => {
    if (isCurrentUser(userId)) {
      return "my-row";
    } else {
      return "leaderBoard-table-row-container";
    }
  };

  return (
    <Container>
      <div className="leaderBoard-title-wrapper"></div>
      <Box className="header-img-data">
        <img
          className="header-medal-img-data"
          src="\src\components\LeaderBoard\—Pngtree—vector award icon_3773685.png"
        />
        Leaderboard
        <img
          className="header-medal-img-data"
          src="\src\components\LeaderBoard\—Pngtree—vector award icon_3773685.png"
        />
      </Box>
      <TableContainer component={Paper} className="leaderBoard-table-container">
        <Table
          sx={{ minWidth: 650 }}
          aria-label="simple table"
          className="leaderBoard-table"
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <div style={{ display: "flex", marginLeft: "10px" }}>Place</div>
              </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right">
                <div style={{ display: "flex", marginLeft: "130px" }}>Name</div>
              </TableCell>
              <TableCell align="right">
                <div style={{ display: "flex", marginLeft: "30px" }}>Items</div>
              </TableCell>
              <TableCell align="right">
                <div style={{ display: "flex", marginRight: "10px" }}>
                  <VolunteerActivismIcon style={{ marginRight: "10px" }} />
                  Lends
                </div>
              </TableCell>
              <TableCell align="right">
                <div style={{ display: "flex", marginRight: "10px" }}>
                  <AutoAwesomeIcon style={{ marginRight: "10px" }} />
                  Borrows
                </div>
              </TableCell>
              <TableCell align="right">
                <div style={{ display: "flex", marginRight: "10px" }}>
                  <img
                    className="points-img-data"
                    src="\src\components\PointsContainer\Star_icon_stylized.svg.png"
                  />
                  Total Points
                </div>
              </TableCell>
            </TableRow>
          </TableHead>

          {rows.length > 0 && (
            <TableBody className="table-body-container">
              {rows.map((row, i) => (
                <TableRow className={getRowClassName(row.userId)} key={i}>
                  <TableCell component="th" scope="row">
                    <PlaceContainer place={i + 1} />
                  </TableCell>
                  <TableCell align="center">
                    <div className="leaderBoard-img-container">
                      <img
                        className="leaderBoard-img-data"
                        src={
                          row.userImg ||
                          "https://material-kit-pro-react.devias.io/assets/avatars/avatar-fran-perez.png"
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <NameContainer name={row.userFullName} />
                  </TableCell>
                  <TableCell align="center">
                    <DetailsContainer details={row.amountOfItems} />
                  </TableCell>
                  <TableCell align="center">
                    <DetailsContainer details={row.amountOfBorrowings} />
                  </TableCell>
                  <TableCell align="center">
                    <DetailsContainer details={row.amountOfLendings} />
                  </TableCell>
                  <TableCell align="center">
                    <ScoreContainer score={row.score} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Container>
  );
};

export default LeaderBoardTable;
