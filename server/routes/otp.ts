import { FastifyInstance } from "fastify";
import { otpController } from "../controllers/otpController";
export function OtpRoute(
  instance: FastifyInstance,
  option: any,
  done: () => void,
) {
  instance.post("/register/send", {}, otpController.sendRegisterOtp);
  instance.post("/register/verify", {}, otpController.verifyRegistrationOtp);
  done();
}
