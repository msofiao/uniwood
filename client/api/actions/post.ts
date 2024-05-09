import { sendPostPostRequest } from "../../utils";

export async function action({ request }: { request: Request; params: any }) {
  let data = null;
  switch (request.method) {
    case "POST":
      data = await sendPostPostRequest(await request.formData());
      break;
      case "PUT":
        data
    default:
      data = null;
  }

  return data;
}