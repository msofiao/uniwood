var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { compare } from "bcrypt";
import { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken, } from "../utils/tokens";
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO add validation
    if (req.body.usernameOrEmail === undefined)
        return res.code(401).send({
            status: "fail",
            message: "FieldError",
            fieldError: [
                { field: "usernameOrEmail", message: "Missing username or email" },
            ],
        });
    if (req.body.password === undefined)
        return res.code(401).send({
            status: "fail",
            message: "FieldError",
            fieldError: [{ field: "password", message: "Missing password" }],
        });
    // check if user exist
    let userExist = null;
    if (req.body.usernameOrEmail.includes("@")) {
        userExist = yield req.prisma.user.findUnique({
            where: {
                email: req.body.usernameOrEmail,
            },
            include: { credential: true },
        });
    }
    else {
        userExist = yield req.prisma.user.findUnique({
            where: {
                username: req.body.usernameOrEmail,
            },
            include: { credential: true },
        });
    }
    if (!userExist || !userExist.credential)
        return res.status(404).send({
            status: "fail",
            error: "UserNotFound",
            message: "User not found",
        });
    const userFullname = userExist.firstname + " " + userExist.lastname;
    // Check if password is match
    const match = yield compare(req.body.password, userExist.credential.password);
    if (!match)
        return res.status(401).send({
            status: "fail",
            error: "IncorrectPassword",
            message: "Password is incorrect",
        });
    // Create tokens
    const accessToken = createAccessToken({
        email: userExist.email,
        id: userExist.id,
        userFullname,
        username: userExist.username,
    });
    const refreshToken = createRefreshToken({
        email: userExist.email,
        id: userExist.id,
    });
    sendRefreshToken(refreshToken, res);
    return sendAccessToken({
        id: userExist.id,
    }, accessToken, res);
});
const loginController = { login };
export default loginController;
