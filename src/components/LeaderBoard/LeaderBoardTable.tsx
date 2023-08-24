import React, { useEffect, useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
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

type Props = {
    rows: ILeaderBoardRow[];
};

const LeaderBoardTable = ({ rows }: Props) => {
    const navigate = useNavigate();

    const getRowClassName = (userId: string): string => {
        if (isCurrentUser(userId)) {
            return "my-row";
        }
        else {
            return "leaderBoard-table-row-container";
        }
    }

    return (
        <div className="leaderBoard-div" style={{ marginBottom: "10px" }}>
            <br />

            <div className="header-img-data">
                <img
                    className="header-medal-img-data"
                    src="\src\components\LeaderBoard\—Pngtree—vector award icon_3773685.png"
                />
                Leaderboard
                <img
                    className="header-medal-img-data"
                    src="\src\components\LeaderBoard\—Pngtree—vector award icon_3773685.png"
                />
            </div>

            {rows.length > 0 && (
                <TableContainer className="leaderBoard-table-container" component={Paper}>
                    <Table className="leaderBoard-table" aria-label="simple table">
                        <TableHead>
                            <TableRow >
                                <TableCell>
                                    <div style={{ display: "flex", marginLeft: "10px" }}>
                                        Place
                                    </div>
                                </TableCell>

                                <TableCell></TableCell>
                                <TableCell>
                                    <div style={{ display: "flex", marginLeft: "130px" }}>
                                        Name
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div style={{ display: "flex", marginLeft: "30px" }}>
                                        Items
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div style={{ display: "flex", marginRight: "10px" }}>
                                        <VolunteerActivismIcon style={{ marginRight: "10px" }} />
                                        Lends
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div style={{ display: "flex", marginRight: "10px" }}>
                                        <AutoAwesomeIcon style={{ marginRight: "10px" }} />
                                        Borrows
                                    </div>
                                </TableCell>
                                <TableCell>
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


                        <TableBody className="table-body-container">
                            {rows.map((row, i) => (
                                <TableRow className={getRowClassName(row.userId)} key={i}>
                                    <TableCell>
                                        <PlaceContainer place={i + 1} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="leaderBoard-img-container">
                                            <img
                                                className="leaderBoard-img-data"
                                                src=
                                                {
                                                    row.userImg ||
                                                    "https://material-kit-pro-react.devias.io/assets/avatars/avatar-fran-perez.png"
                                                }
                                            />
                                        </div>

                                    </TableCell>
                                    <TableCell>
                                        <NameContainer name={row.userFullName} />
                                    </TableCell>
                                    <TableCell>
                                        <DetailsContainer details={row.amountOfItems} />
                                    </TableCell>
                                    <TableCell>
                                        <DetailsContainer details={row.amountOfBorrowings} />
                                    </TableCell>
                                    <TableCell>
                                        <DetailsContainer details={row.amountOfLendings} />
                                    </TableCell>
                                    <TableCell>
                                        <ScoreContainer score={row.score} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default LeaderBoardTable;
