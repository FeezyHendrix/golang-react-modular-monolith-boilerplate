import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";
import VerifyOTP from "../auth/VerifyOTP";
import Dashboard from "../Dashboard";
import { AuthGuard } from "./AuthGuard";
import Users from "../Users";
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
                path: "/users",
                element: <Users />
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