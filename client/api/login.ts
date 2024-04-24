import { redirect } from "react-router-dom";
import { sendLoginRequest, sendRefreshTokenRequest } from "../utils";
import axiosClient from "../utils/axios";

/**
 * Login user
 * @param param0
 * @returns
 */
export async function loginAction({
  request,
}: {
  request: Request;
  params: any;
}) {
  let formData = await request.formData();
  let data = null;

  switch (request.method) {
    case "POST":
      {
        data = await axiosClient
          .post(
            "/login",
            {
              usernameOrEmail: formData.get("usernameOrEmail"),
              password: formData.get("password"),
            },
            { withCredentials: true },
          )
          .then((res) => res.data)
          .catch((err) => err.response?.data);
      }
      break;
    default:
      data = null;
  }
  return data;
}

/**
 * Redirects user to home page if refresh token is valid
 * @returns
 */
export async function loginLoader() {
  const data = await sendRefreshTokenRequest();
  if (data?.status === "success") {
    redirect("/");
  } else return data;
}

export const login = ({
  emailOrUsername,
  password,
}: {
  emailOrUsername: string;
  password: string;
}) => {
  return axiosClient.post("/login", { emailOrUsername, password });
};
