import React from "react";
import { createRoot } from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import { store } from "./app/store";
import App from "./App";
import ItemDetailsPage from "./routes/itemDetailsPage";
import UserPage from "./routes/userPage";

import "./index.css";
import ErrorPage from "./routes/errorPage";
import FacebookLoginPage from "./routes/facebookLoginPage";
import "react-datepicker/dist/react-datepicker.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AddItemPage from "./routes/addItemPage";
import UserEditPage from "./routes/userEditPage";
import NewUserPage from "./routes/newUserPage";
import EditItemPage from "./routes/editItemPage";
import RequestToBookPage from "./routes/requestToBookPage";
import ResponsiveAppBar from "./components/AppBar/AppBar";
import MyAddressesPage from "./routes/myAddressesPage";
import MyItemsPage from "./routes/myItemsPage";
import LenderDashboard from "./routes/lenderDashboard";
import BorrowerDashboard from "./routes/borrowerDashboard";
import ReservationDetailsPage from "./routes/resarvationDetailsPage";

const container = document.getElementById("root")!;
const root = createRoot(container);

const router = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "item/:itemId",
    element: <ItemDetailsPage />,
  },
  {
    path: "login",
    element: <FacebookLoginPage />,
  },
  {
    path: "addItem",
    element: <AddItemPage />,
  },
  {
    path: "myItems",
    element: <MyItemsPage />,
  },
  {
    path: "lenderDashboard",
    element: <LenderDashboard />,
  },
  {
    path: "borrowerDashboard",
    element: <BorrowerDashboard />,
  },
  {
    path: "/users/:userId",
    element: <UserPage />,
  },
  {
    path: "/users/:userId/edit",
    element: <UserEditPage />,
  },
  {
    path: "/newUser",
    element: <NewUserPage />,
  },
  {
    path: "/editItem/:itemId",
    element: <EditItemPage />,
  },
  {
    path: "/requestToBook/:itemId",
    element: <RequestToBookPage />,
  },
  {
    path: "/reservationDetails/:reservationId",
    element: <ReservationDetailsPage />,
  },
  {
    path: "address",
    element: <MyAddressesPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
];

root.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <BrowserRouter>
        <ResponsiveAppBar />
        <Routes>
          {router.map((routeItem, i) => (
            <Route path={routeItem.path} element={routeItem.element} key={i} />
          ))}
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>
);
