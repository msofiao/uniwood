import { FastifyCorsOptions } from "@fastify/cors";
import { config } from "dotenv";
import path from "node:path";

config({ path: path.resolve(import.meta.dirname, "../../.env") });

console.log(`https://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`);
export const corsOption: FastifyCorsOptions = {
  origin: [
    `https://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`,
    `https://localhost:${process.env.CLIENT_PORT}`,
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};
