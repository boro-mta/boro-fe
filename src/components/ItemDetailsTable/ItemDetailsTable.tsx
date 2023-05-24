import { Divider, Typography } from "@mui/material";
import { ITableData } from "../../types";

export const Row = ({ tableData }: ITableData) => {
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