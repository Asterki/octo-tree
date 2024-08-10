import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/globals.css";

import LoginPage from "./pages/login.tsx"
import RegisterPage from "./pages/register.tsx"
import DashboardPage from "./pages/dashboard.tsx";
import IndexPage from "./pages/index.tsx";

import TestPage from "./pages/test.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <IndexPage />,
    },
    {
        path: "/dashboard",
        element: <DashboardPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "/test",
        element: <TestPage />,
    }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
