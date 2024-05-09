"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("./routes"));
async function app(instance, opts, done) {
    instance.get("/", async (req, res) => {
        res.status(200).send({
            hello: "World",
        });
    });
    instance.register(routes_1.default, { prefix: "/api/v1" });
    done();
}
exports.default = app;
