import { FastifyInstance } from "fastify/types/instance";
import { searchController } from "../controllers/searchController";

function Search(fastify: FastifyInstance, _options: any, done: () => void) {
  fastify.get("/:search", {}, searchController.search);
  done();
}

module.exports = Search;
