import React, { useEffect, useState } from "react";
import { searchByTitle } from "../../api/ItemService";
import ISearchResult from "../../api/Models/ISearchResult";
import { useAppSelector } from "../../app/hooks";
import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";
import SearchResultView from "./SearchResultView";
import { useNavigate } from "react-router";
import SearchIcon from "@mui/icons-material/Search";
import "./searchbar.style.css";

const SearchBar = () => {
  const navigate = useNavigate();
  const [selectedResultTitle, setSelectedResultTitle] = useState<string>("");

  const currentLocation = useAppSelector((state) => state.user.currentAddress);
  const userId = useAppSelector((state) => state.user.userId);

  const [results, setResults] = useState<ISearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const sendSearchRequest = async (searchTerm: string) => {
    try {
      if (userId != null && searchTerm !== "") {
        setShowDropdown(true);
        let latitude = currentLocation.latitude;
        let longitude = currentLocation.longitude;
        const response = await searchByTitle(
          searchTerm,
          latitude,
          longitude,
          50000,
          10
        );
        setResults(response as ISearchResult[]);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleResultClick = (id: string, title: string) => {
    setResults([]);
    setSelectedResultTitle(title);
    setShowDropdown(false);
    navigate(`/item/${id}`);
  };

  const handleInputChanged = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    if (event && event.type !== "blur") {
      sendSearchRequest(value);
      setSelectedResultTitle(value);
    }
  };
  return (
    <div style={{ flex: 1 }}>
      <Autocomplete
        open={showDropdown}
        inputValue={selectedResultTitle}
        noOptionsText=""
        sx={{ width: "300px" }}
        getOptionLabel={(option) => option.title}
        onInputChange={(event, value) => handleInputChanged(event, value)}
        filterOptions={(result) => result}
        placeholder="Search..."
        onFocus={() => {
          setShowDropdown(true);
          sendSearchRequest(selectedResultTitle);
        }}
        onBlur={() => setShowDropdown(false)}
        renderOption={(props, option) => (
          <SearchResultView
            Result={option}
            onResultClick={handleResultClick}
            key={option.id}
          />
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            InputProps={{
              sx: {
                borderRadius: "15px",
              },
              ...params.InputProps,
              endAdornment: <SearchIcon />,
            }}
            InputLabelProps={{
              shrink: showDropdown || selectedResultTitle !== "",
            }}
          />
        )}
        options={results}
      />
    </div>
  );
};

export default SearchBar;
