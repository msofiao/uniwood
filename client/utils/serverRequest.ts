import { AxiosError } from "axios";
import axiosClient from "./axios";

export const sendLoginRequest = async (form: FormData) => {
  const res = await axiosClient
    .post(
      "/login",
      {
        usernameOrEmail: form.get("usernameOrEmail"),
        password: form.get("password"),
      },
      { withCredentials: true }
    )
    .then((res) => res.data)
    .catch((err: AxiosError) => err.response?.data);

  return res;
};

export const sendRefreshTokenRequest = async () => {
  return axiosClient
    .post("/refresh_token", {}, { withCredentials: true })
    .then((res) => res.data)
    .catch((err: AxiosError) => err.response?.data);
};

export const sendUserInfoRequest = async (id: string) => {
  return axiosClient
    .get(`/users/${id}`)
    .then((res) => res.data)
    .catch((err: AxiosError) => err.response?.data);
};

export const sendTestRequest = async () => {
  return axiosClient
    .put(`/test`, {}, { withCredentials: true })
    .then((res) => res.data)
    .catch((err: AxiosError) => err.response?.data);
};

export const sendPostPostRequest = async (form: FormData) => {
  return axiosClient
    .post(`/posts`, form, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((res) => res.data)
    .catch((err: AxiosError) => err.response?.data);
};
