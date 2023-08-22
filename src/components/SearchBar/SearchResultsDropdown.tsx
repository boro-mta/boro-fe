import React from "react";

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

interface SearchResultsDropdownProps {
    results: SearchResult[];
    onSelectResult: (result: SearchResult) => void;
}

const dropdownStyle = {
    width: "100%",
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "4px",
    zIndex: "1",
};

const searchResultItemStyle = {
    display: "flex",
    alignItems: "center",
    padding: "8px",
    cursor: "pointer",
};

const imageStyle = {
    width: "40px",
    height: "40px",
    marginRight: "10px",
};

const titleStyle = {
    fontWeight: "bold",
    color: "black",
};

const SearchResultsDropdown: React.FC<SearchResultsDropdownProps> = ({
    results,
    onSelectResult,
}) => {
    return (
        <div
            className="search-results-dropdown"
            style={{ ...dropdownStyle }}
        >
            <ul>
                {results.map((result, index) => (
                    <li
                        key={result.id}
                        onClick={() => onSelectResult(result)}
                        style={{
                            ...searchResultItemStyle,
                            top: `${index * 50}px`, // Adjust the spacing between results
                        }}
                    >
                        <div style={imageStyle}>
                            <img src={result.image.base64ImageData} alt="Result" />
                        </div>
                        <div style={titleStyle}>{result.title}</div>
                        {/* You can add more details here if needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResultsDropdown;