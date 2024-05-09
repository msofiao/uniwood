import dotenv from "dotenv";
import path from "node:path";
import Fastify from "fastify";
dotenv.config({ path: path.resolve(import.meta.url, "../.env") });
const app = Fastify({
    logger: true,
});
app.register(import("./app"), { prefix: "/" });
export default async (req, res) => {
    await app.ready();
    app.server.emit("request", req, res);
};
