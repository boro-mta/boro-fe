import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { IFullItemDetailsNew } from "../types";

type Props = {};

type IFullItemDetailsParams = {
    itemId: string;
};

const EditItemPage = (props: Props) => {
    const navigate = useNavigate();

    const [itemDetails, setItemDetails] = useState<IFullItemDetailsNew>({
        categories: [],
        condition: "",
        itemId: "",
        title: "",
        images: [],
        description: "",
        excludedDates: [],
    });

    let { itemId } = useParams<IFullItemDetailsParams>();


    return (
        <div id="edit-item-page">
            <p>This page is under constraction</p>
        </div>
    );
};

export default EditItemPage;