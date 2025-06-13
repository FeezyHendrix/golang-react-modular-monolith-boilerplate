import { getSession, refreshTokenFn } from "@/utils/session";
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
      const session = getSession();
      if (session?.accessToken) {
        config.headers["Authorization"] = `Bearer ${session.accessToken}`;
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

        const result = await refreshTokenFn();

        if (result?.accessToken) {
          config.headers = {
            ...config.headers,
            authorization: `Bearer ${result?.accessToken}`,
          };
        }

        return axios(config);
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const axiosPrivate = configureAxiosPrivate(axios);
