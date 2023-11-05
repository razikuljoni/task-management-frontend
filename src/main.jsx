import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import AddTask from "./components/AddTask.jsx";
import Login from "./components/Login.jsx";
import "./index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <App>
                <AddTask />{" "}
            </App>
        ),
    },
    {
        path: "/login",
        element: (
            <App>
                <Login />{" "}
            </App>
        ),
    },
    {
        path: "/register",
        element: (
            <App>
                <Login />{" "}
            </App>
        ),
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
