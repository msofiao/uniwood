import logoutController from "../controllers/logoutController";
import { FastifyInstance } from "../types/fastify";

function logout(instance: FastifyInstance, _option: any, done: () => void) {
  instance.post("/", logoutController.logout);
  done();
}

module.exports = logout;
