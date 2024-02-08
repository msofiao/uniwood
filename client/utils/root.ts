import { AxiosError } from "axios";
import axiosClient from "./axios";

export const refreshTokenRequest = async () => {
  return axiosClient
    .post("/refresh_token", {}, { withCredentials: true })
    .then((res) => res.data)
    .catch((err: AxiosError) => err.response?.data);
};
