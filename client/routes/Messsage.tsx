import {
  useContext,
  useEffect,
  useState,
} from "react";
import Nav from "../components/Nav";
import { UserInfoContext } from "../providers/UserInfoProvider";
import { TokenContext } from "../providers/TokenProvider";
import { useLoaderData, useParams } from "react-router-dom";
import MessageList from "../components/MessageList";
import Conversation from "../components/Conversation";
import MessageUserDetail from "../components/MessageUserDetail";
import { MessageComponentContext } from "../context/mesComContext";
import axiosClient from "../utils/axios";

export default function Message() {
  const params = useParams<{ converseId?: string; recipientId?: string }>();
  const { setUserInfo } = useContext(UserInfoContext)!;
  const { accessToken, setAccessToken } = useContext(TokenContext)!;
  const { userInfoResponse, refreshTokenResponse } = useLoaderData() as {
    userInfoResponse: UserInfoResponseData;
    refreshTokenResponse: RefreshTokenResponseData;
  };
  const [searchNewUserFocus, setSearchNewUserFocus] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState<IRecipientInfo>();

  const initializeUserIdentity = () => {
    setUserInfo(userInfoResponse);
    setAccessToken(refreshTokenResponse.accessToken);
    localStorage.setItem("accessToken", refreshTokenResponse.accessToken);
    localStorage.setItem("id", refreshTokenResponse.id);
  };
  const initializeRecipientInfo = () => {
    if (params.converseId && accessToken) {
      axiosClient
        .get(`/converse/recipient?converseId=${params.converseId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setRecipientInfo(res.data.data);
        });
    } else if (params.recipientId && accessToken) {
      axiosClient
        .get(`/users/${params.recipientId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setRecipientInfo({
            id: res.data.data.id,
            recipientId: res.data.data.id,
            fullname: res.data.data.fullname,
            pfp: res.data.data.pfp,
            username: res.data.data.username,
          });
        });
    }
  };

  useEffect(initializeUserIdentity, []);
  useEffect(initializeRecipientInfo, [
    params.converseId,
    accessToken,
    params.recipientId,
  ]);

  return (
    <MessageComponentContext.Provider
      value={{
        searchNewUserFocus,
        setSearchNewUserFocus,
        recipientInfo,
        setRecipientInfo,
      }}
    >
      <div className="grid h-screen grid-cols-[325px_375px_500px_minmax(0,_1fr)]">
        <Nav />
        <MessageList />
        <Conversation />
        <MessageUserDetail />
      </div>
    </MessageComponentContext.Provider>
  );
}
