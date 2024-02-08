import refrehTokenController from "../controllers/refreshToken";
import {

  FastifyInstance,
} from "../types/fastify";


function refreshToken(
  instance: FastifyInstance,
  _options: any,
  done: () => void
) {
  instance.post("/", refrehTokenController.refreshToken);
  done();
}

module.exports = refreshToken;
