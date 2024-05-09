import { FastifyInstance } from "fastify";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(import.meta.url, "../.env") });

export default function App(
  instance: FastifyInstance,
  _options: any,
  done: () => void,
) {
  instance.get("/test", async (_req, res) => {
    return res.code(200).send({ status: "success", message: "Test Route" });
  });
  instance.get("/", async (_req, res) => {
    return res
      .code(200)
      .send({ status: "success", message: "Welcome to the API" });
  });

  done();
}
