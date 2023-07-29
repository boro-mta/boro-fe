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
            <Autocomplete onLoad={onLoad} onPlaceChanged={handlePlaceChanged}>

                <input
                    defaultValue={savedAddress}
                    type="text"
                    placeholder="Search for address"
                    style={{ width: "100%", height: "100%" }}
                />


                {/* <TextField
                    //defaultValue={savedAddress}
                    label="Address"
                    value={savedAddress}
                    placeholder="Search for address"
                    style={{ width: "100%", height: "100%" }}
                /> */}
            </Autocomplete>
        </>
    );
}

export default AddressField;