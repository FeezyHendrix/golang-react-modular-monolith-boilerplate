import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";
import VerifyOTP from "../auth/VerifyOTP";
import Dashboard from "../Dashboard";
import { AuthGuard } from "./AuthGuard";
import QueryBuilder from "../query-builder/QueryBuilder";
import SqlQuery from "../query-builder/SqlQuery";
import Python from "../query-builder/Python";
import Canvas from "../Canvas";
import Decisioning from "../Decisioning";
import DataSources from "../DataSources";
import Documents from "../Documents";
import Settings from "../Settings";
import Users from "../Users";
import Reports from "../Reports";
import RoleManagement from "../RoleManagement";
import { createBrowserRouter, Navigate } from "react-router-dom";
import NotFound from "../NotFound";

export const routes = [
    {
        path: "/signup",
        element: <SignUp />
    },
    {
        path: "/login",
        element: <SignIn />
    },
    {
        path: "/verify-otp",
        element: <VerifyOTP />
    },
    {
        element: <AuthGuard />,
        children: [
            {
                path: "/",
                element: <Dashboard />
            },
            {
                path: "/query-builder",
                element: <QueryBuilder />
            },
            {
                path: "/query-builder/sql",
                element: <SqlQuery />
            },
            {
                path: "/query-builder/python",
                element: <Python />
            },
            {
                path: "/automation",
                element: <Canvas />
            },
            {
                path: "/decisioning",
                element: <Decisioning />
            },
            {
                path: "/data-sources",
                element: <DataSources />
            },
            {
                path: "/documents",
                element: <Documents />
            },
            {
                path: "/settings",
                element: <Settings />
            },
            {
                path: "/users",
                element: <Users />
            },
            {
                path: "/reports",
                element: <Reports />
            },
            {
                path: "/roles",
                element: <RoleManagement />
            },
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
]

export const router = createBrowserRouter(routes);