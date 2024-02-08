import { PrismaClient, Role, User } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
// Add decorators
declare module "fastify" {
  export interface FastifyInstance {
    prisma: PrismaClient;
    test: string;
  }

  export interface FastifyRequest {
    prisma: PrismaClient;
    userId: string;
    role: Role;
  }
  export interface FastifyReply {}
}

export { FastifyInstance, FastifyRequest, FastifyReply };
