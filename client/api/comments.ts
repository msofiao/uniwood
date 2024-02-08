import axiosClient from "../utils/axios";
import { postsAction } from "./posts";

export async function commentsAction({
  request,
  params,
}: {
  request: Request;
  params: any;
}) {
  const formData = await request.formData();
  let data = null;

  switch (request.method) {
    case "GET":
      if (params!.commentId !== undefined) {
        data = axiosClient.get(`/comments/${params!.commentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
      }
      break;
    case "POST":
      data = axiosClient.post(
        "/comments",
        {
          comment: formData.get("comment"),
          posts_id: formData.get("posts_id"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      break;
    case "PUT":
      data = axiosClient.put(
        "/comments",
        {
          comment: formData.get("comment"),
          commentId: formData.get("commentId"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      break;
    case "DELETE":
      data = axiosClient.delete("/comments", {
        data: {
          commentId: formData.get("commentId"),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      break;
  }
}
