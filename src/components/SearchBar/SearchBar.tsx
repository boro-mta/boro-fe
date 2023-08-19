import React, { useState, useEffect } from "react";

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

    // Function to handle search term changes
    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Function to send the search request to the server
    const sendSearchRequest = async () => {
        try {
            // You can modify the URL based on your server's endpoint
            const response = await fetch(
                `/Items/Search/ByTitle?partialTitle=${searchTerm}&latitude=0&longitude=0&radiusInMeters=5000&limit=100`
            );
            if (response.ok) {
                console.log(response);
                const data = await response.json();
                onSearchResults(data); // Pass the search results to the parent component
                setResults(data); // Update the local results state
            }
            else {
                console.log(response.status)
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    useEffect(() => {
        sendSearchRequest();
    }, [searchTerm]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchTermChange}
            />
            <ul>
                {results.map((result) => (
                    <li key={result.id}>{result.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBar;
