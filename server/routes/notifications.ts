import { FastifyInstance } from "../types/fastify";

import { notificationController } from "../controllers/notificationController";

export function NotificationRoute(
  fastify: FastifyInstance,
  _options: any,
  done: () => void
) {
  fastify.get("/:userId", notificationController.getNotification);
  done();
}
