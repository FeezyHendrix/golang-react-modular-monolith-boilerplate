import { axiosPrivate } from "./client";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  id: string;
}

export const getUserRequest = () => {
    return axiosPrivate.get<UserProfile>('/user/profile');
}