import { FastifyInstance, FastifyRequest } from "../types/fastify";
import { multipartConsumer } from "../middlewares/multipartConsumer";

export function TestRoute(
  instance: FastifyInstance,
  _options: any,
  done: () => void
) {
  instance.post(
    "/test",
    { preHandler: multipartConsumer },
    async (req: FastifyRequest<{ Body: Record<string, any> }>, res) => {
      // console.log({ body: req.body });
      return res.send({ message: "Hello World", body: req.body });
    }
  );
  done();
}
