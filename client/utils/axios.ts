import axios from "axios";

const axiosClient = axios.create({ baseURL: process.env.BASE_SERVER_URL });


export default axiosClient;
