import { FastifyReply, FastifyRequest } from "../types/fastify";
import { storeFile } from "../utils/fileManager";

export async function multipartConsumer(
  req: FastifyRequest<{ Body: any }>,
  res: FastifyReply
) {
  let body: Record<string, any> = {};
  if (!req.isMultipart() || req.isMultipart() === undefined) return;

  const parts = req.parts();

  try {
    for await (const part of parts) {
      // Store file to a temporary Folder
      if (part.type === "file") {
        console.log(part.fields);
        if (part.file.truncated)
          return res.status(413).send({ message: "File too large" });

        if (
          part.filename === undefined ||
          part.filename === null ||
          part.filename === ""
        ) {
          part.file.on("data", () => {});
          part.file.on("end", () => {});
          continue;
        }
        storeFile(part, "tmp")
          .then((fileInfo) => {
            body[part.fieldname] = fileInfo;
          })
          .catch((error) => {
            console.error("Error in Multiaprt Consumer", error);
            body[part.fieldname] = null;
          });
      } else if (part.type === "field") {
        console.log({ fields: part.fieldname });
        body[part.fieldname] = part.value;
      }
    }
  } catch (error) {
    console.error("Error in Multiaprt Consumer", error);
    res.status(500).send({ message: "Internal Server Error" });
  } finally {
    req.body = body;
    console.log({ body });
  }
}

// function partsConsumer(pstyd )
