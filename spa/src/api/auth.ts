import { axiosV1Public } from "./client"

export const loginRequest = async (data: {email: string, password: string}) => {
    return axiosV1Public.post('/auth/login', data)
}


export const signupRequest = async (data) => {
    return axiosV1Public.post('/auth/signup', data)
}


export const refreshTokenRequest = async (data) => {
    return axiosV1Public.post('/auth/refresh-token', data)
}


export const signOutRequest = async () => {
    return axiosV1Public.post('/auth/logout');
}