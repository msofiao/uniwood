import { useEffect, useState } from "react";
import axiosClient from "../utils/axios";

export default function Notification() {
  const [, setData] = useState({});

  useEffect(() => {
    axiosClient
      .get(`/notification/${'sdf'}`)
      .then((res) => setData(res.data.data))
      .catch(console.error);
  });
  return <div>Notification</div>;
}
