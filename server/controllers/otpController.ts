import { FastifyRequest, FastifyReply } from "fastify";
import { sendRegistrationOTP as mailRegistrationOtp } from "../utils/mailer";
import { randomInt } from "node:crypto";

const sendRegisterOtp = async (
  req: FastifyRequest<{ Body: { email: string } }>,
  res: FastifyReply,
) => {
  const { email } = req.body;

  // chekck if email already exist;
  const userExist = await req.prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
    },
  });
  if (userExist)
    return res
      .status(400)
      .send({ status: "fail", message: "Email already exist" });

  const sixDigitOtp = randomInt(100000, 999999).toString();

  try {
    // Sent OTP via email
    await mailRegistrationOtp(
      { to: req.body.email },
      { otp: sixDigitOtp.split("") },
    );

    // Save OTP in DB
    await req.prisma.registerOTP.create({
      data: {
        email,
        otp: sixDigitOtp,
      },
    });

    // Delete OTP after 30 minutes
    setTimeout(
      async () => {
        await req.prisma.registerOTP.delete({
          where: {
            email,
          },
        });
      },
      1000 * 60 * 30,
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "fail",
      message: "Internal server error",
    });
  }
  return res.status(200).send({
    status: "success",
    message: "OTP sent successfully",
  });
};

const verifyRegistrationOtp = async (
  req: FastifyRequest<{ Body: { email: string; otp: string } }>,
  res: FastifyReply,
) => {
  const emailExist = await req.prisma.registerOTP.findUnique({
    where: {
      email: req.body.email,
    },
    select: {
      email: true,
      otp: true,
    },
  });

  // Check if email exist
  if (!emailExist)
    return res.status(404).send({
      status: "fail",
      error: "EmailNotFound",
      message: "Email not found",
    });

  // Check if email matched
  if (emailExist.otp !== req.body.otp)
    return res.status(400).send({
      status: "fail",
      error: "InvalidOTP",
      message: "Invalid OTP",
    });

  // Delete OTP after verification
  await req.prisma.registerOTP.delete({
    where: {
      email: req.body.email,
    },
  });

  return res.status(200).send({
    status: "success",
    message: "OTP verified successfully",
  });
};

export const otpController = {
  sendRegisterOtp,
  verifyRegistrationOtp,
};
