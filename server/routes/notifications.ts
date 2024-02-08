import { FastifyInstance } from "../types/fastify";

import { notificationController } from "../controllers/notificationController";

function Notification(
  fastify: FastifyInstance,
  _options: any,
  done: () => void
) {
  fastify.get("/:userId", notificationController.getNotification);
  done();
}

module.exports = Notification;
