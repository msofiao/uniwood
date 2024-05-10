import { converseController } from "../controllers/converseController";
import { authorize } from "../middlewares/authorize";
import { arbitraryMultipartConsumer } from "../middlewares/multipartConsumer";
import { FastifyInstance } from "../types/fastify";

export  function ConverseRoute(
  instance: FastifyInstance,
  option: any,
  done: () => void,
) {
  instance.post(
    "/sendMessage",
    { preValidation: [authorize("USER"), arbitraryMultipartConsumer] },
    converseController.sendMessage,
  );

  instance.get(
    "/search",
    { preValidation: [authorize("USER")] },
    converseController.searchConversation,
  );

  instance.get(
    "/",
    { preValidation: [authorize("USER")] },
    converseController.getConverse,
  );

  instance.get(
    "/list",
    { preValidation: [authorize("USER")] },
    converseController.getConverseList,
  );

  instance.get(
    "/recipient",
    { preValidation: [authorize("USER")] },
    converseController.getRecipient,
  );
  instance.get(
    "/media",
    { preValidation: [authorize("USER")] },
    converseController.getConverseMedia,
  );
  done();
}
