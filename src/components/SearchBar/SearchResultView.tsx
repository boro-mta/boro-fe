import React from "react";
import ISearchResult from "../../api/Models/ISearchResult";
import { Box } from "@mui/material";
import { formatImagesOnRecieve } from "../../utils/imagesUtils";
import { IInputImage } from "../../types";

type Props = {
  Result: ISearchResult;
  onResultClick: (id: string, title: string) => void;
};

const titleStyle = {
  fontWeight: "bold",
  color: "black",
};

const imageStyle = {
  width: "40px",
  height: "40px",
  marginRight: "10px",
};

const searchResultItemStyle = {
  display: "flex",
  alignItems: "center",
  padding: "8px",
  cursor: "pointer",
};

const SearchResultView = ({ Result, onResultClick }: Props) => {
  return (
    <Box
      key={Result.id}
      onClick={() => onResultClick(Result.id, Result.title)}
      style={{
        ...searchResultItemStyle,
      }}
    >
      <div style={imageStyle}>
        <img
          style={imageStyle}
          src={`${Result.image.base64ImageMetaData},${Result.image.base64ImageData}`}
          alt="Result"
        />{" "}
      </div>
      <div style={titleStyle}>{Result.title}</div>
    </Box>
  );
};

export default SearchResultView;
