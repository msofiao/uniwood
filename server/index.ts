import fastify from "fastify";
import dotenv from "dotenv";
import path from "node:path";
import fastifyCookie from "@fastify/cookie";
import "@fastify/multipart";
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = fastify();

// ===== CORE PLUGINS ===== //
app.register(require("@fastify/cors"), require("./config/corsOption"));
app.register(require("@fastify/multipart"));
app.register(fastifyCookie, require("./config/cookieOption"));
app.register(require("@fastify/static"), require("./config/staticOption"));

// ======= Decorators ======== //

// ===== HOOKS ===== //
app.addHook("onError", (_req, _res, error, done) => {
  console.log(error);
  done();
});
// app.addHook("preValidation", (req, _res, done) => {
//   console.log({
//     RuequestInfo: {
//       path: req.url,
//       isMultipart: req.isMultipart(),
//       body: req.body,
//       params: req.params,
//       query: req.query,
//       cookies: req.cookies,
//     },
//   });
//   done();
// });

app.addHook("onRequest", require("./hooks/onRequestHook"));
// ====== ROUTES ===== //
app.register(require("./routes/users.ts"), { prefix: "/users" });
app.register(require("./routes/testRoute.ts"));
app.register(require("./routes/login.ts"), { prefix: "/login" });
app.register(require("./routes/logout.ts"), { prefix: "/logout" });
app.register(require("./routes/refreshToken.ts"), { prefix: "/refresh_token" });
app.register(require("./routes/posts.ts"), { prefix: "/posts" });
app.register(require("./routes/comments.ts"), { prefix: "/comments" });
app.register(require("./routes/projects.ts"), { prefix: "/projects" });
app.register(require("./routes/search.ts"), { prefix: "/search" });
app.register(require("./routes/notifications.ts"), {
  prefix: "/notifications",
});

app.put("/test", async (req, res) => {
  console.log({ cookies: req.cookies });
  res.cookie("none,T,T", "test", {
    sameSite: "lax",
    secure: true,
    httpOnly: true,
  });
  return res.code(404).send({ status: "fail", message: "Not foundxx" });
});

app.listen(
  {
    port: parseInt(process.env.SERVER_PORT as string),
    host: process.env.SERVER_HOST as string,
  },
  (err, address) => {
    if (err) throw err;
    console.log(`Server listening at ${address}`);
  }
);
