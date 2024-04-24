import { AxiosError } from "axios";
import axiosClient from "../utils/axios";
export async function usersAction({
  request,
  params,
}: {
  request: Request;
  params: any;
}) {
  const formData = await request.formData();
  let data;
  switch (request.method) {
    case "GET":
      {
        try {
          await axiosClient.get("/users").then((res) => (data = res.data));
        } catch (error) {
          console.log((error as AxiosError).response?.data);
        }
      }
      break;
    case "POST":
      {
        try {
          await axiosClient
            .post("/users", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
            })
            .then((res) => (data = res.data));
        } catch (error) {
          console.error((error as AxiosError).response?.data);
          return (error as AxiosError).response?.data;
        }
      }
      break;
    case "PUT":
      {
        try {
          await axiosClient
            .put(`/users/${params.id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => (data = res.data));
        } catch (error) {
          console.error((error as AxiosError).response?.data);
          return (error as AxiosError).response?.data;
        }
      }
      break;
    case "DELETE": {
      try {
        data = await axiosClient
          .put(`/users/${params.id}`, formData)
          .then((res) => (res = res.data));
      } catch (error) {
        console.error((error as AxiosError).response?.data);
        return (error as AxiosError).response?.data;
      }
    }
  }
  return data;
}

export async function usersLoader() {}
