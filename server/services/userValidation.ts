import { UserPostBody } from "../controllers/usersController";
import { FastifyRequest, FastifyReply } from "../types/fastify";

export default async function postUserValidation(
  req: FastifyRequest<{ Body: UserPostBody }>,
  res: FastifyReply,
  done: () => void
) {

  done();
}
