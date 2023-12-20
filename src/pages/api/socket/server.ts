import type { Server as HttpServer } from "http";
import type { Socket as NetSocket } from "net";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as ServerIO } from "socket.io";
import { Server as ServerIo } from "socket.io";

import { randomInt } from "crypto";
import { GameState, quoteLengthType } from "../../../types";

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

const gamePlayers: { [key: string]: string } = {};
const gameState: { [key: string]: GameState } = {};

const ioHandler = (_: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log("socket.io already running");
  } else {
    console.log("socket.io is initializing");
    const io = new ServerIo(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log(`Socket ${socket.id} connected`);

      socket.on(
        "create-game",
        (quoteLength: quoteLengthType, userName: string) => {
          const gameCodeInit = randomInt(1000, 9999);
          const gameCode = `${gameCodeInit}`;

          gamePlayers[socket.id] = `${gameCode}`;

          gameState[gameCode] = {
            players: { owner: { id: socket.id, wordIndex: 0, name: userName } },
            quoteLength: quoteLength,
          };

          socket.join(gameCode);
          socket.emit("has-joined-game", gameCode, userName);
          io.sockets.to(gameCode).emit("game-state", gameState[gameCode]);
        }
      );

      socket.on("join-game", (gameCode: string, userName: string) => {
        if (!gameState.hasOwnProperty(gameCode)) {
          console.log("join-game-error");
          socket.emit("join-game-error");
          return;
        }

        gamePlayers[socket.id] = gameCode;
        gameState[gameCode].players.guest = {
          id: socket.id,
          wordIndex: 0,
          name: userName,
        };

        socket.join(gameCode);
        socket.emit("has-joined-game", gameCode, userName);

        let testText =
          gameState[gameCode].quoteLength === "long"
            ? "ene bol long text turshih code bolno"
            : "ene bol short text turshina";

        gameState[gameCode].testText = testText;
        io.sockets.to(gameCode).emit("test-text", testText);

        //counter
        const counterTime = 5000;
        const startsAt = new Date().getTime() + counterTime;

        io.sockets.to(gameCode).emit("game-starts-in", counterTime);

        const interval = setInterval(() => {
          const remaining = startsAt - new Date().getTime();
          if (remaining > 0) {
            io.sockets.to(gameCode).emit("game-starts-in", remaining);
          } else {
            io.sockets.to(gameCode).emit("lets-go");
            clearInterval(interval);
          }
        }, 1000);

        io.sockets.to(gameCode).emit("game-state", gameState[gameCode]);
      });

      socket.on("leave-game", () => {
        console.log(`Socket ${socket.id} leave-game`);

        const gameCode = gamePlayers[socket.id];

        if (!gameCode || !gameState[gameCode]) {
          return;
        }

        delete gamePlayers[socket.id];

        const player =
          gameState[gameCode].players.owner.id === socket.id
            ? "owner"
            : "guest";

        const opponentPlayerState =
          gameState[gameCode].players[player === "owner" ? "guest" : "owner"];

        if (!opponentPlayerState || opponentPlayerState?.disconnected) {
          io.sockets.to(gameCode).emit("deleted-game");
          delete gameState[gameCode];
        } else {
          gameState[gameCode].players[player]!.disconnected = true;
          io.sockets.to(gameCode).emit("opponent-disconnected");
        }
      });
    });
  }

  res.end();
};

export default ioHandler;
