import React, { useState } from "react";
import { searchByTitle } from "../../api/ItemService";
import ISearchResult from "../../api/Models/ISearchResult";
import { useAppSelector } from "../../app/hooks";
import { Autocomplete, TextField } from "@mui/material";
import SearchResultView from "./SearchResultView";
import { useNavigate } from "react-router";

const SearchBar = () => {
    const navigate = useNavigate();
    const [selectedResultTitle, setSelectedResultTitle] = useState<string>(""); // State to store selected result's title

    const currentLocation = useAppSelector(state => state.user.currentAddress);
    const userId = useAppSelector(state => state.user.userId);

    const [results, setResults] = useState<ISearchResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const sendSearchRequest = async (searchTerm: string) => {
        try {
            if (userId != null && searchTerm !== "") {
                setShowDropdown(true);
                let latitude = currentLocation.latitude;
                let longitude = currentLocation.longitude;
                const response = await searchByTitle(searchTerm, latitude, longitude, 50000, 10);
                setResults(response as ISearchResult[]);
            }
            else {
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
    }

    return (
        <div style={{ flex: 1 }}>
            <Autocomplete
                open={showDropdown}
                noOptionsText=""
                sx={{ width: "200px" }}
                getOptionLabel={(option) => option.title}
                onInputChange={(event, value) => sendSearchRequest(value)}
                filterOptions={(result) => result}
                placeholder="Search..."
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setShowDropdown(false)}
                renderOption={(props, option) => <SearchResultView Result={option} onResultClick={handleResultClick} />}
                renderInput={(params) => (
                    <TextField
                        value={selectedResultTitle}
                        onChange={(event) => {
                            setSelectedResultTitle(event.target.value);
                        }}
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
