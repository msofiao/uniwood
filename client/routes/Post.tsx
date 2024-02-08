import { useEffect, useState } from "react";
import axiosClient from "../utils/axios";
import { AxiosError } from "axios";
import { sendPostPostRequest } from "../utils";

export async function action({ request }: { request: Request; params: any }) {
  let data = null;
  switch (request.method) {
    case "POST":
      data = await sendPostPostRequest(await request.formData());
      break;
    default:
      data = null;
  }
  return data;
}
export default function Post({ postId }: { postId: string }) {
  const [post, setPost] = useState<post | null>(null);
  useEffect(() => {
    axiosClient
      .get(`/post/${postId}`)
      .then((res) => {
        setPost(res.data.data);
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  });
  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.context}</p>
    </div>
  );
}

// TypeDefs
type post = {
  id: string;
  context: string;
  title: string | null;
  tags: string[] | null;
  liked_by_users_id: string[];
  createdAt: Date;
  media: {
    filename: string;
    caption?: string;
  }[];
  author: {
    id: string;
    firstname: string;
    lastname: string;
    proffeciency: string;
    affiliation: string;
    user_image: {
      pfp_name: string;
      cover_name: string;
    };
  };
  comments?: {
    content: string;
    createdAt: string;
    up_voted_by_users_id: string[];
    author: {
      firstname: string;
      lastname: string;
      proffeciency: string;
      affilitation: string;
      user_image: { pfp_name: string; cover_name: string };
    };
  }[];
};
