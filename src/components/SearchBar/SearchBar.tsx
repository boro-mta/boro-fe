import { Api } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { HttpOperation, requestAsync } from "../../api/BoroWebServiceClient";
import { getUserLocation } from "../../api/UserService";
import { getCurrentUserId } from "../../utils/authUtils";
import { isEmptyArray } from "formik";
import SearchResultsDropdown from "./SearchResultsDropdown";

interface SearchResult {
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    image: {
        imageId: string;
        base64ImageMetaData: string;
        base64ImageData: string;
    };
}

interface SearchBarProps {
    onSearchResults: (results: SearchResult[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const sendSearchRequest = async () => {
        try {
            let userId = getCurrentUserId();
            if (userId != null && searchTerm != "") {
                let userLocationDetails = getUserLocation(userId);
                let latitude = (await userLocationDetails).latitude
                let longitude = (await userLocationDetails).longitude
                let endpoint = `Items/Search/ByTitle?partialTitle=${searchTerm}&latitude=31.760521&longitude=35.201366&radiusInMeters=50000000&limit=100`;
                const response = await requestAsync(HttpOperation.GET, endpoint);
                console.log(response);
                setResults(response as SearchResult[]);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    useEffect(() => {
        sendSearchRequest();
    }, [searchTerm]);

    const handleSelectResult = (result: SearchResult) => {

        console.log("Selected result:", result);
    };


    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchTermChange}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setShowDropdown(false)}
            />
            {showDropdown && results.length > 0 && (
                <SearchResultsDropdown
                    results={results}
                    onSelectResult={handleSelectResult}
                />
            )}
        </div>
    );
};

export default SearchBar;
