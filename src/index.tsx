import React from "react";
import { createRoot } from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./app/store";
import App from "./App";
import ItemPage from "./routes/itemPage";
import "./index.css";
import ErrorPage from "./routes/errorPage";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import FacebookLoginPage from "./routes/facebookLoginPage";

const container = document.getElementById("root")!;
const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "item/:itemId",
    element: <ItemPage />,
  },
  {
    path: "/login",
    element: <FacebookLoginPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

root.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <RouterProvider router={router} />
    </StoreProvider>
  </React.StrictMode>
);
