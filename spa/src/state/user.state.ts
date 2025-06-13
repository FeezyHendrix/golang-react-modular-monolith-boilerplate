import { UserProfile } from "@/api/user";
import { create } from "zustand";

export const useUserStore = create<UserProfile>(() => ({
    id: "",
    firstName:"",
    lastName:"",
    email: "",
    roles: [],
}));