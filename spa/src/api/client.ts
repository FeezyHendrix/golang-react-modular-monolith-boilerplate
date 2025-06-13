import { useAuthStore } from "@/state/user.state";
import { refreshTokenRequest } from "@/api/auth";
import axios, { Axios, AxiosError } from "axios";

export const axiosV1Public = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

axios.defaults.baseURL = `/api/v1`;

const configureAxiosPrivate = (axiosInstance: Axios): Axios => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const { accessToken } = useAuthStore.getState();
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error?.config;

      if (error?.response?.status === 401 && !config?.sent) {
        config.sent = true;

        try {
          const { refreshToken } = useAuthStore.getState();
          if (refreshToken) {
            const { data } = await refreshTokenRequest({ refreshToken });
            
            if (data?.access_token) {
              useAuthStore.getState().updateTokens(data.access_token, data.refresh_token || refreshToken);
              config.headers = {
                ...config.headers,
                authorization: `Bearer ${data.access_token}`,
              };
              return axios(config);
            }
          }
        } catch (refreshError) {
          useAuthStore.getState().logout();
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const axiosPrivate = configureAxiosPrivate(axios);
