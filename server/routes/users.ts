import { FastifyInstance } from "fastify";
import userController from "../controllers/usersController";
import { multipartConsumer } from "../middlewares/multipartConsumer";

import {
  userPutOnResponseHandler,
  usersPostOnResponseHandler,
} from "../services/usersHandler";
import { authorize } from "../middlewares/authorize";

export function UsersRoute(
  instance: FastifyInstance,
  _options: any,
  done: () => void
) {
  instance.get("/newUsers", userController.getNewUsers);

  instance.get("/", userController.getAllusers);
  instance.get("/:id", userController.getUser);
  instance.delete("/", userController.deleteUser);

  instance.put(
    "/",
    {
      preValidation: [authorize("ANY"), multipartConsumer],
      onResponse: userPutOnResponseHandler,
    },
    userController.updateUser
  );
  instance.post(
    "/",
    {
      preValidation: [multipartConsumer],
      onResponse: usersPostOnResponseHandler,
    },
    userController.createUser
  );
  instance.get(
    "/raw/:usernameOrId",
    { preValidation: [authorize("ANY")] },
    userController.getUserRawData
  );

  done();
}
