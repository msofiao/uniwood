import { FastifyRequest } from "../types/fastify";

export function requestFieldChecker(fields: string[], req: FastifyRequest) {
  const error: string[] = [];

  Object.entries(req.body as Object).forEach(([key, value]) => {
    if (fields.includes(key) && (value === undefined || value === null))
      error.push(key);
  });

  return error;
}
