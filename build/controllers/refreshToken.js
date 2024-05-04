var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken, } from "../utils/index.ts";
import dotenv from "dotenv";
import path from "node:path";
dotenv.config({
    path: path.resolve(import.meta.dirname, "../.env"),
});
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if refresh token exist
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken)
        return res.code(401).send({
            status: "fail",
            error: "Missing RefeshToken Cookie",
            message: "Unauthorized",
        });
    // Check if token is valid
    let payload;
    try {
        payload = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_KEY);
    }
    catch (error) {
        console.error(error);
        return res.code(401).send({
            status: "fail",
            error: "TokenMalformed",
            message: "Unauthorize",
        });
    }
    // replace tokens
    const refreshToken = createRefreshToken({
        email: payload.email,
        id: payload.id,
    });
    const accessToken = createAccessToken({
        email: payload.email,
        id: payload.id,
        userFullname: payload.userFullname,
        username: payload.username,
    });
    // sendTokens
    sendRefreshToken(refreshToken, res);
    return sendAccessToken({
        id: payload.id,
    }, accessToken, res);
});
const refrehTokenController = { refreshToken };
export default refrehTokenController;
