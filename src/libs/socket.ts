import { io } from "socket.io-client";

// Create a socket connection
// const socket = io({ autoConnect: false });
// fetch("http://localhost:3000/api/socket/server");
const socket = io("http://localhost:3000/api/socket/server");

export default socket;
