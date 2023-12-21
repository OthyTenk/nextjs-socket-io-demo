"use client";

import { useCallback, useEffect, useState } from "react";
import Game from "../components/Game";
import InitGame from "../components/GameModal";
import useGlobal from "../hooks/useGlobal";
import useSocket from "../hooks/useSocket";

const ChatPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [gameCode, setGameCode] = useState("");
  const { currentUser } = useGlobal();
  const { socket } = useSocket();

  const onLeaveGame = useCallback(() => {
    setGameCode("");
    socket.emit("leave-game");
  }, [socket]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected!!");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("disconnect!!");
      setIsConnected(false);
      onLeaveGame();
    });

    socket.on("has-joined-game", (roomCode: string, userName: string) => {
      console.log("has-joined-game");
      setGameCode(roomCode);
    });

    //deleted-game
    socket.on("deleted-game", () => {
      console.log("deleted-game!!");
      setIsConnected(false);
      setGameCode("");
    });

    return () => {
      socket.off("has-joined-game");
      socket.off("deleted-game");
      // socket.disconnect();
    };
  }, [socket, onLeaveGame]);

  return (
    <>
      <header className="bg-neutral-900 text-neutral-400">
        {gameCode.length > 0 && (
          <button
            className="p-2 bg-orange-600/50 rounded-lg"
            onClick={onLeaveGame}
          >
            Leave Game (<span className="font-semibold">{currentUser}</span>)
          </button>
        )}
      </header>
      <main className="h-screen p-4 bg-neutral-900 text-neutral-400">
        {gameCode.length === 0 && <InitGame isSocketConnected={isConnected} />}

        {gameCode.length > 0 && <Game gameCode={gameCode} />}
      </main>
    </>
  );
};

export default ChatPage;
