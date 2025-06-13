import { getUserRequest } from "@/api/user";
import { signOutRequest } from "@/api/auth";
import MainLayout from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuthStore } from "@/state/user.state";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const showUserIntializationErrToast = (onReset: () => void) => {
  toast.error(
    "Something unexpected happened. Reset your session. If the issue still persists, please contact support.",
    {
      id: "initialization-error",
      duration: Infinity,
      action: {
        label: "Reset Session",
        onClick: onReset,
      },
      dismissible: false,
    }
  );
};

export const AuthGuard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setUser, logout, initializeAuth, isAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOutRequest();
    } catch (e) {
      console.error("Logout error:", e);
    }
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const initializeSession = async () => {
      try {
        initializeAuth();
        
        if (isAuthenticated) {
          setLoading(false);
          return;
        }

        const res = await getUserRequest();
        const user = res?.data;
        if (user) {
          setUser(user);
          setLoading(false);
        } else {
          handleLogout();
        }
      } catch (e) {
        if ((e as AxiosError)?.response?.status === 401) {
          handleLogout();
        } else {
          showUserIntializationErrToast(handleLogout);
        }
      }
    };

    initializeSession();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
