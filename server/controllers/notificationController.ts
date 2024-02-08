import { FastifyRequest, FastifyReply } from "../types/fastify";

const getNotification = async (req: FastifyRequest, res: FastifyReply) => {
  const notifData = await req.prisma.user.findMany({
    where: {
      notification: {
        some: {
          user_id: req.userId,
        },
      },
    },
  });

  return res.send({
    status: "success",
    message: "Successfully fetched notification",
    data: notifData,
  });
};

export const notificationController = { getNotification };
