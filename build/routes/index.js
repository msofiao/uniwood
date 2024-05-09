"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes = async (server) => {
    server.register(async (instance, opts, done) => {
        instance.get("/", async (req, res) => {
            const { name = "" } = req.query;
            res.status(200).send(`Hello ${name}`);
        });
        instance.get("/:name", async (req, res) => {
            const { name = "" } = req.params;
            res.status(200).send(`Hello ${name}`);
        });
        done();
    }, {
        prefix: "/hello",
    });
};
exports.default = routes;
