import { otpController } from "../controllers/otpController";
export function OtpRoute(instance, option, done) {
    instance.post("/register/send", {}, otpController.sendRegisterOtp);
    instance.post("/register/verify", {}, otpController.verifyRegistrationOtp);
    done();
}
