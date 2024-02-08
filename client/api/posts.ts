import { AxiosError } from "axios";
import axiosClient from "../utils/axios";

export async function postsAction({
  request,
}: {
  request: Request;
  params: any;
}) {
  // ! Debugging =====================
  console.log("Entered Post Route");
  const form = await request.formData();
  console.log({ form });
  form.forEach((value, key) => {
    {
      console.log(key, value);
    }
  });
  //  !============================

  let data = null;
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  };
  const multiPartConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "multipart/form-data",
    },
  };

  switch (request.method) {
    case "GET":
      {
        data = await axiosClient
          .get(`/posts`, config)
          .catch((err: AxiosError) => err.response?.data);
      }
      break;
    case "POST":
      {
        data = await axiosClient
          .post(`/posts`, form, multiPartConfig)
          .then((res) => res.data.data)
          .catch((err: AxiosError) => err.response?.data);
      }
      break;

    case "PUT":
      {
        data = axiosClient
          .put(`/posts`, form, multiPartConfig)
          .then((res) => res.data.data)
          .catch((err: AxiosError) => err.response?.data);
      }
      break;
    case "DELETE": {
      data = axiosClient
        .delete(`/posts`, config)
        .then((res) => res.data.data)
        .catch((err: AxiosError) => err.response?.data);
    }
    default:
      // Remove the line with 'never'
      data = null;
  }
  return "";
}

export function postsLoader() {
  return null;
}
