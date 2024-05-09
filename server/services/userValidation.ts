import { UserPostBody } from "../controllers/usersController";
import type { FastifyRequest, FastifyReply } from "../types/fastify.d";

export default async function postUserValidation(
  req: FastifyRequest<{ Body: UserPostBody }>,
  res: FastifyReply,
  done: () => void,
) {
  done();
}
