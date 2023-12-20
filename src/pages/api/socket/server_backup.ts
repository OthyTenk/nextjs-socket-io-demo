import type { Server as HttpServer } from "http";
import type { Socket as NetSocket } from "net";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as ServerIO } from "socket.io";
import { Server as ServerIo } from "socket.io";

import { randomInt } from "crypto";
import { RaceState, quoteLengthType } from "../../../types";

interface SocketServer extends HttpServer {
  io?: ServerIO | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// const clientRooms: Rooms = {};
const clientRooms: { [key: string]: string } = {};
const roomState: { [key: string]: RaceState } = {};

const ioHandler = (_: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log("socket.io already running");
    res.end();
    return;
  }
  console.log("socket.io is initializing");

  const httpServer: HttpServer = res.socket.server;
  // const io = new ServerIo(httpServer, {
  //   addTrailingSlash: false,
  //   cors: {
  //     origin: "*",
  //     methods: ["POST", "GET"],
  //   },
  // });
  const io = new ServerIo(httpServer);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log(`Socket ${socket.id} connected`);

    socket.on("create-room", (quoteLength: quoteLengthType) => {
      console.log(`quoteLength : ${quoteLength}`);
      // const roomCode = randomInt(1000, 9999).toString();
      const roomCode = randomInt(1000, 9999);

      console.log(roomCode);
      clientRooms[socket.id] = `${roomCode}`;
      console.log(roomCode);

      roomState[roomCode] = {
        players: { owner: { id: socket.id, wordIndex: 0 } },
        quoteLength: quoteLength,
      };

      console.log(JSON.stringify(clientRooms[socket.id]));
      console.log(JSON.stringify(roomState[roomCode]));

      socket.join(roomCode);
      socket.emit("has-joined-room", roomCode);
      io.sockets.to(roomCode).emit("room-state", roomState[roomCode]);

      console.log(roomState);
    });

    socket.on("join-room", (roomCode: string) => {
      console.log(`join-room: ${roomCode}`);

      const ooo = `\\"${roomCode}\\"`;
      console.log(ooo);
      const oo1 = `"${roomCode}"`;
      console.log(oo1);

      console.log({ roomState });

      if (!roomState.hasOwnProperty(roomCode)) {
        console.log("join-room-error");
        socket.emit("join-room-error");
        return;
      }

      console.log("joined");

      clientRooms[socket.id] = roomCode;
      roomState[roomCode].players.guest = {
        id: socket.id,
        wordIndex: 0,
      };

      console.log(JSON.stringify(roomState[roomCode]));
      socket.join(roomCode);
      socket.emit("has-joined-room", roomCode);

      let testText =
        roomState[roomCode].quoteLength === "long"
          ? "ene bol long text turshih code bolno"
          : "ene bol short text turshina";

      roomState[roomCode].testText = testText;
      io.sockets.to(roomCode).emit("test-text", testText);

      //counter
      const counterTime = 5000;
      const startsAt = new Date().getTime() + counterTime;

      console.log({ startsAt });

      io.sockets.to(roomCode).emit("game-starts-in", counterTime);

      const interval = setInterval(() => {
        const remaining = startsAt - new Date().getTime();

        console.log({ remaining });

        if (remaining > 0) {
          io.sockets.to(roomCode).emit("game-starts-in", remaining);
        } else {
          io.sockets.to(roomCode).emit("lets-go");
          clearInterval(interval);
        }
      }, 1000);

      // console.log(interval);

      io.sockets.to(roomCode).emit("room-state", roomState[roomCode]);
    });

    socket.on("leave-game", () => {
      console.log(`Socket ${socket.id} leave-game`);

      const roomCode = clientRooms[socket.id];

      if (!roomCode || !roomState[roomCode]) {
        return;
      }

      delete clientRooms[socket.id];

      const player =
        roomState[roomCode].players.owner.id === socket.id ? "owner" : "guest";

      const opponentPlayerState =
        roomState[roomCode].players[player === "owner" ? "guest" : "owner"];

      if (!opponentPlayerState || opponentPlayerState?.disconnected) {
        delete roomState[roomCode];
      } else {
        roomState[roomCode].players[player]!.disconnected = true;
        io.to(opponentPlayerState.id).emit("opponent-disconnected");
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);

      const roomCode = clientRooms[socket.id];

      if (!roomCode || !roomState[roomCode]) {
        return;
      }

      delete clientRooms[socket.id];

      const player =
        roomState[roomCode].players.owner.id === socket.id ? "owner" : "guest";

      const opponentPlayerState =
        roomState[roomCode].players[player === "owner" ? "guest" : "owner"];

      if (!opponentPlayerState || opponentPlayerState?.disconnected) {
        delete roomState[roomCode];
      } else {
        roomState[roomCode].players[player]!.disconnected = true;
        io.to(opponentPlayerState.id).emit("opponent-disconnected");
      }
    });
  });

  res.end();
};

export default ioHandler;
