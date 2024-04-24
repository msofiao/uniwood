import { redirect } from "react-router-dom";
import { sendRefreshTokenRequest, sendUserInfoRequest } from "../../utils";

export async function loader() {
  const refreshTokenResponse = await sendRefreshTokenRequest();
  const userInfoResponse = await sendUserInfoRequest(
    localStorage.getItem("id") as string,
  );

  if (
    refreshTokenResponse?.status === "success" &&
    userInfoResponse?.status === "success" &&
    userInfoResponse?.data.id === localStorage.getItem("id")
  ) {
    localStorage.setItem("accessToken", refreshTokenResponse.accessToken);
  } else {
    console.error({ userInfoResponse, refreshTokenResponse });
    return redirect("/login");
  }
  return { userInfoResponse: userInfoResponse.data, refreshTokenResponse };
}
