import axiosClient from "../../utils/axios";

export async function profileAction({
  params,
  request,
}: {
  params: any;
  request: Request;
}) {
  const formData = await request.formData();
  console.log({ params });
  let data = null;

  data = await axiosClient
    .put(`users`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data)
    .catch((err) => err);

  return data;
}
