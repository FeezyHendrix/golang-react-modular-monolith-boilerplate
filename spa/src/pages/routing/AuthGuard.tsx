import { getUserRequest } from "@/api/user";
import MainLayout from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useUserStore } from "@/state/user.state";
import { onLogout } from "@/utils/session";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const showUserIntializationErrToast = () => {
  toast.error(
    "Something unexpected happened. Reset your session. If the issue still persists, please contact support.",
    {
      id: "initialization-error",
      duration: Infinity,
      action: {
        label: "Reset Session",
        onClick: () => onLogout(() => ((window as Window).location = "/login")),
      },
      dismissible: false,
    }
  );
};

export const AuthGuard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const res = await getUserRequest();
        const user = res?.data;
        if (user) {
          useUserStore.setState(user);
          setLoading(false);

        } else {
          onLogout(() => navigate("/login"));
        }
      } catch (e) {
  
        if ((e as AxiosError)?.response?.status === 401) {
                console.log("Error here", e)
          onLogout(() => navigate("/login"));
        } else {
          showUserIntializationErrToast();
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
