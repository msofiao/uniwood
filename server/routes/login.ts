import loginController from "../controllers/loginController";
import { FastifyInstance } from "../types/fastify";

function Login(instance: FastifyInstance, _option: any, done: () => void) {
  instance.post("/", loginController.login);
  done();
}

module.exports = Login;
