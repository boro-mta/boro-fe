import React, { useEffect, useState } from "react";
import { searchByTitle } from "../../api/ItemService";
import ISearchResult from "../../api/Models/ISearchResult";
import { useAppSelector } from "../../app/hooks";
import { Autocomplete, TextField } from "@mui/material";
import SearchResultView from "./SearchResultView";
import { useNavigate } from "react-router";

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
        setShowDropdown(false);
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

  const handleInputChanged = (value: string) => {
    sendSearchRequest(value);
    setSelectedResultTitle(value);
  };
  return (
    <div style={{ flex: 1 }}>
      <Autocomplete
        open={showDropdown}
        inputValue={selectedResultTitle}
        noOptionsText=""
        sx={{ width: "200px" }}
        getOptionLabel={(option) => option.title}
        onInputChange={(event, value) => handleInputChanged(value)}
        filterOptions={(result) => result}
        placeholder="Search..."
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
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        options={results}
      />
    </div>
  );
};

export default SearchBar;
