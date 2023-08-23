import React, { useEffect, useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Container,
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

type Props = {
    rows: ILeaderBoardRow[];
};

const LeaderBoardTable = ({ rows }: Props) => {
    const navigate = useNavigate();

    const [relevantClassName, setRelevantClassName] = useState<string>("leaderBoard-table-row-container");

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
            <Typography variant="h6" gutterBottom style={{ margin: "10px 0px" }}>
                Leader Board
            </Typography>

            {rows.length > 0 && (
                <TableContainer className="leaderBoard-table-container" component={Paper}>
                    <Table className="leaderBoard-table" aria-label="simple table">
                        <TableHead className="leaderBoard-head-table">
                            <TableRow>
                                <TableCell>Place</TableCell>
                                <TableCell></TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Items</TableCell>
                                <TableCell>Lends</TableCell>
                                <TableCell>Borrows</TableCell>
                                <TableCell>Total Points</TableCell>
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
