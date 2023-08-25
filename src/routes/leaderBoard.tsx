import React from "react";
import LeaderBoardTable from "../components/LeaderBoard/LeaderBoardTable";
import { userPointsDetails } from "../mocks/userPoints";

const LeaderBoard = () => {
    return (
        <div>
            <LeaderBoardTable rows={userPointsDetails} />
        </div>
    );
};

export default LeaderBoard;