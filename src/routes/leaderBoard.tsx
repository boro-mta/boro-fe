import React, { useEffect, useState } from "react";
import LeaderBoardTable from "../components/LeaderBoard/LeaderBoardTable";
import { getTop10Statistics, getUserProfile } from "../api/UserService";
import IUserStatistics from "../api/Models/IUserStatistics";
import { IInputImage, ILeaderBoardRow } from "../types";
import { formatImagesOnRecieve } from "../utils/imagesUtils";

const LeaderBoard = () => {
  const [rowsToShow, setRowsToShow] = useState<any>([]);

  const fromUserStatisticsToLeaderBoardRows = async (
    serverTopTenLeaders: IUserStatistics[]
  ) => {
    let leaderBoardRowsToReturn: ILeaderBoardRow[] = [];
    let index = 1;

    let allUserDetailsPromises =
      serverTopTenLeaders && serverTopTenLeaders.length > 0
        ? serverTopTenLeaders.map(async (user: IUserStatistics) => {
            const serverUserDetails = await getUserProfile(user.userId);
            let serverFullUserName: string = serverUserDetails.firstName.concat(
              " " + serverUserDetails.lastName
            );

            let row: ILeaderBoardRow = {
              userFullName: serverFullUserName,
              userId: serverUserDetails.userId,
              userImg: formatImagesOnRecieve([
                serverUserDetails.image as IInputImage,
              ])[0],
              score: user.totalScore,
              amountOfItems: user.amountOfItems,
              amountOfLendings: user.amountOfLendings,
              amountOfBorrowings: user.amountOfLendings,
            };

            leaderBoardRowsToReturn.push(row);
            index++;

            return row;
          })
        : [];

    leaderBoardRowsToReturn = await Promise.all(allUserDetailsPromises);

    const leadersByPlace: ILeaderBoardRow[] = [...leaderBoardRowsToReturn].sort(
      (a, b) => {
        return b.score - a.score;
      }
    );

    return leadersByPlace;
  };

  useEffect(() => {
    const getLeaderBoardRows = async () => {
      const serverTopTenLeaders: IUserStatistics[] = await getTop10Statistics();
      if (serverTopTenLeaders.length > 0) {
        const serverTopTenLeadersAsLeaderBoardRows = await fromUserStatisticsToLeaderBoardRows(
          serverTopTenLeaders
        );

        setRowsToShow(serverTopTenLeadersAsLeaderBoardRows);
      }
    };

    getLeaderBoardRows();
  }, []);

  return (
    <div>{rowsToShow.length > 0 && <LeaderBoardTable rows={rowsToShow} />}</div>
  );
};

export default LeaderBoard;
