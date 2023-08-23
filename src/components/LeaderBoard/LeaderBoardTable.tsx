import React from "react";

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

type Props = {
    rows: ILeaderBoardRow[];
};

const LeaderBoardTable = ({ rows }: Props) => {
    const navigate = useNavigate();

    //todo: check if I'm the user and make another background color, change the className accordingly

    return (
        <div className="leaderBoard-div" style={{ marginBottom: "10px" }}>
            <br />
            <Typography variant="h6" gutterBottom style={{ margin: "10px 0px" }}>
                Leader Board
            </Typography>

            {rows.length > 0 && (
                <TableContainer className="leaderBoard-table-container" component={Paper}>
                    <Table className="leaderBoard-table" aria-label="simple table">

                        <TableBody className="table-body-container">
                            {rows.map((row) => (
                                <TableRow className="leaderBoard-table-row-container">
                                    <TableCell>
                                        <PlaceContainer place={row.place} />
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
