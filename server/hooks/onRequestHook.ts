import { PrismaClient } from "@prisma/client";
import type { FastifyRequest, FastifyReply } from "../types/fastify.d.ts";

export function onRequestHook(
  req: FastifyRequest,
  _res: FastifyReply,
  done: () => void,
) {
  // Decorators
  req.prisma = new PrismaClient();
  done();
}
