import { FastifyRequest, FastifyReply } from "../types/fastify";
import { verify } from "jsonwebtoken";
import path from "node:path";
import dotenv from "dotenv";
;
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});
/**
 * Checks if user is Authorize
 * @param userRole Role of the user
 * @returns
 */
export const authorize = (userRole: "USER" | "ADMIN" | "ANY") => {
  return async (req: FastifyRequest<{ Body: any }>, res: FastifyReply) => {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken)
      return res.status(401).send({
        status: "fail",
        message: "Unauthorized",
        error: "No AccessToken",
      });

    const payload = verify(accessToken, process.env.ACCESS_TOKEN_KEY!) as {
      id: string;
      email: string;
    };

    // check if user exist and roles is match
    const userExist = await req.prisma.user.findUnique({
      where: { id: (payload as any).id },
      select: { role: true },
    });

    if (!userExist || userExist?.role === userRole || userRole !== "ANY")
      return res.status(401).send({ status: "fail", message: "Unauthorized" });

    // attach userId
    req.userId = payload.id;
  };
};
