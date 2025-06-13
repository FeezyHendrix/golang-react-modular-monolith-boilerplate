import { signOutRequest } from "@/api/auth";
import { axiosV1Public } from "@/api/client";
import { AxiosError } from "axios";
import { get } from "http";
import { NavigateFunction } from "react-router-dom";

export const SessionKey = "session";
export function getSession(): any | null {
  const session = localStorage.getItem(SessionKey);
  if (session) {
    return JSON.parse(session);
  }
  return null;
}

export const setLocalStorageSession = (session: string) => {
  localStorage.setItem(SessionKey, session);
};

export const refreshTokenFn = async () => {
  const sessionFromLS = getSession() || {};

  try {
    const { data } = await axiosV1Public.post("/auth/refreshtoken", {
      refreshToken: sessionFromLS?.refreshToken,
    });

    setLocalStorageSession(JSON.stringify(data));

    return data;
  } catch (err) {
    if ((err as AxiosError)?.response?.status === 401) {
      onLogout(() => (window as Window).location.assign("/login"));
      return;
    }
    throw err;
  }
};

export const onLogout = async (navigate: NavigateFunction) => {
  try {
    localStorage.removeItem(SessionKey);
  } catch (e) {
    console.error(e);
  }

  try {
    await signOutRequest();
  } catch (e) {
    console.error(e);
  }

  navigate("/login");
};

