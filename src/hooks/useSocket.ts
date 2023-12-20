import { Socket, io } from "socket.io-client";
let socket: Socket;

const useSocket = () => {
  if (!socket) {
    fetch("http://localhost:3000/api/socket/server");
    socket = io();
  }

  return { socket };
};

export default useSocket;
