import { baseURL } from "@/libs/utils";
import { Socket, io } from "socket.io-client";
let socket: Socket;

const useSocket = () => {
  if (!socket) {
    const baseUrl = baseURL();
    fetch(`${baseUrl}/api/socket/server`);
    socket = io();
  }

  return { socket };
};

export default useSocket;
