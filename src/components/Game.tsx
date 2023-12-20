"use client";
import useGlobal from "@/hooks/useGlobal";
import useSocket from "@/hooks/useSocket";
import { GameState } from "@/types";
import { useEffect, useState } from "react";
import WaitingBoard from "./WaitingBoard";

const Game = ({ gameCode }: { gameCode: string }) => {
  const [game, setGame] = useState<GameState | null>(null);
  const [counterTime, setCounterTime] = useState(0);
  const { currentUser } = useGlobal();
  const { socket } = useSocket();

  useEffect(() => {
    socket.on("game-state", (argGameState: GameState) => {
      setGame(argGameState);
    });

    socket.on("game-starts-in", (counterTime: number) => {
      setCounterTime(Math.max(Math.ceil(counterTime / 1000), 1));
    });

    socket.on("lets-go", () => {
      setCounterTime(0);
    });

    //opponent-disconnected
    socket.on("opponent-disconnected", () => {
      setGame(null);
    });

    return () => {
      socket.off("game-state");
      socket.off("game-starts-in");
      socket.off("lets-go");
      socket.off("opponent-disconnected");
      setGame(null);
    };
  }, [socket]);

  return (
    <main>
      {!game?.players?.guest ? (
        game?.players.guest?.disconnected ||
        game?.players.owner?.disconnected ? (
          <div>
            <button>Try again</button>
          </div>
        ) : (
          game?.players?.owner && (
            <WaitingBoard
              gameCode={gameCode}
              userName={game?.players?.owner?.name}
            />
          )
        )
      ) : (
        <div>
          guest:{" "}
          {game?.players?.guest?.name === currentUser
            ? game?.players?.owner.name
            : game?.players?.guest?.name}
          {counterTime > 0 && <div>{counterTime}</div>}
        </div>
      )}
    </main>
  );
};

export default Game;
