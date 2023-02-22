import React from "react";
import { Routes, Route, useParams } from "react-router-dom";

type Props = {};

const itemPage = (props: Props) => {
  let { itemId } = useParams();
  return <div>itemPage {itemId}</div>;
};

export default itemPage;
