import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/globals.css";

import LoginPage from "./pages/login.tsx"
import RegisterPage from "./pages/register.tsx"
import Dashboard from "./pages/dashboard.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
