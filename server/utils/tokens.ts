import { sign } from "jsonwebtoken";
import path from "node:path";
import dotenv from "dotenv";
import { FastifyReply } from "../types/fastify";
import { accessTokenOption, refreshTokenOptions } from "../config/jwtOption";
;
import "@fastify/cookie";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

export const createAccessToken = (userInfo: {
  email: string;
  id: string;
  userFullname: string;
  username: string;
}) => {
  return sign(
    userInfo,
    process.env.ACCESS_TOKEN_KEY as string,
    accessTokenOption
  );
};

export const createRefreshToken = (userInfo: { email: string; id: string }) => {
  return sign(
    userInfo,
    process.env.REFRESH_TOKEN_KEY as string,
    refreshTokenOptions
  );
};

export const sendRefreshToken = (token: string, res: FastifyReply) => {
  res.setCookie("refreshToken", token, {
    httpOnly: true,
    path: "/refresh_token",
    sameSite: "none",
    secure: true,
  });
};

export const sendAccessToken = (
  userInfo: {
    id: string;
  },
  token: string,
  res: FastifyReply
) => {
  return res.send({ status: "success", accessToken: token, ...userInfo });
};
