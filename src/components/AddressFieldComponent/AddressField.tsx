import { Autocomplete } from "@react-google-maps/api";
import React from "react";
import TextField from "@mui/material/TextField";

type Props = {
    onLoad: (autocomplete: google.maps.places.Autocomplete) => void;
    handlePlaceChanged: () => void;
    savedAddress: string | number;
};

const AddressField = ({ onLoad, handlePlaceChanged, savedAddress }: Props) => {
    return (
        <>
            {savedAddress && (
                <Autocomplete onLoad={onLoad} onPlaceChanged={handlePlaceChanged}>
                    <TextField
                        defaultValue={savedAddress}
                        label="Address"
                        placeholder="Search for address"
                        style={{ width: "100%", height: "100%" }}
                    />
                </Autocomplete>

            )}
        </>
    );
}

export default AddressField;