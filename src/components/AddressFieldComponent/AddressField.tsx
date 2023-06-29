import { Container } from "@mui/system";
import { Autocomplete } from "@react-google-maps/api";
import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";

type Props = {
    onLoad: (autocomplete: google.maps.places.Autocomplete) => void;
    handlePlaceChanged: () => void;
};

const libs: (
    | "places"
    | "drawing"
    | "geometry"
    | "localContext"
    | "visualization"
)[] = ["places"];

const AddressField = ({ onLoad, handlePlaceChanged }: Props) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
        libraries: libs,
    });

    return (
        <>
            {isLoaded && (
                <Autocomplete onLoad={onLoad} onPlaceChanged={handlePlaceChanged}>
                    <input
                        type="text"
                        placeholder="Search for address"
                        style={{ width: "100%", height: "100%" }}
                    />
                </Autocomplete>
            )
            }
        </>
    );
}

export default AddressField;