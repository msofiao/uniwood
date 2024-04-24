import { io } from "socket.io-client";

export const socketClient = io(`${process.env.WS_SERVER_URL}`);
