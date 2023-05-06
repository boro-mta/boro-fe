import React from "react";
import { createRoot } from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
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
import ResponsiveAppBar from "./components/AppBar/AppBar";

const container = document.getElementById("root")!;
const root = createRoot(container);

const router = createBrowserRouter([
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
    path: "editItem/:itemId",
    element: <EditItemPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

root.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <BrowserRouter>
        <ResponsiveAppBar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="item/:itemId" element={<ItemDetailsPage />} />
          <Route path="login" element={<FacebookLoginPage />} />
          <Route path="addItem" element={<AddItemPage />} />
          <Route path="/users/:userId" element={<UserPage />} />
          <Route path="/users/:userId/edit" element={<UserEditPage />} />
          <Route path="/newUser" element={<NewUserPage />} />
          <Route path="editItem/:itemId" element={<EditItemPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>
);
