"use client";
import useGlobal from "@/hooks/useGlobal";
import useSocket from "@/hooks/useSocket";
import { quoteLengthType } from "@/types";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface Props {
  isSocketConnected: boolean;
}

const GameModal: FC<Props> = ({ isSocketConnected }) => {
  const router = useRouter();
  const [inputCode, setInputCode] = useState("");
  const { currentUser, setCurrentUser } = useGlobal();
  const [codeError, setCodeError] = useState(false);
  const [userName, setUserName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [quoteLength, setQuoteLength] = useState<quoteLengthType>("short");
  const { socket } = useSocket();

  const onCreateGame = () => {
    socket.emit("create-game", quoteLength, currentUser);
  };

  const onJoinGame = () => {
    if (inputCode.length !== 4) return;

    setCodeLoading(true);
    socket.emit("join-game", inputCode, currentUser);
  };

  useEffect(() => {
    socket.on("join-game-error", () => {
      setCodeLoading(false);
      setCodeError(true);
    });

    return () => {
      socket.off("join-game-error");
    };
  }, [socket]);

  useEffect(() => {
    setCodeLoading(false);
  }, [isSocketConnected]);

  const onBuildGame = () => {
    if (userName.length < 3) {
      setNameError(true);
    } else {
      setNameError(false);
      setCurrentUser(userName);
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-3xl mx-auto items-center">
      {!isSocketConnected && (
        <div className="flex flex-col p-4 m-4 items-center">
          <span className="text-rose-500">
            Trying to connect to the server...
          </span>
          <button onClick={() => router.refresh()}>
            Please refresh the web...
          </button>
        </div>
      )}
      {currentUser && `User: ${currentUser}`}
      {currentUser && currentUser.length >= 3 ? (
        <div
          className={`flex flex-col w-full md:flex-row items-center justify-between gap-2 ${
            !isSocketConnected ? "opacity-75" : ""
          }`}
        >
          <div className="border flex flex-1 flex-col w-full space-y-2 border-orange-100 p-4 rounded-xl">
            <h2 className="text-xl font-semibold">Create</h2>

            <div className="flex gap-2">
              <h3 className="">Qoute Length:</h3>
              <div className="">
                <button onClick={() => setQuoteLength("short")}>short</button>
              </div>
            </div>

            <button
              className="py-2 px-4 h-[41px] text-white bg-amber-600/50 rounded-lg hover:shadow-lg"
              disabled={!isSocketConnected}
              onClick={onCreateGame}
            >
              Create Game
            </button>
          </div>
          <div className="text-center m-2">or</div>
          <div className="border border-orange-100 flex flex-1 flex-col w-full px-4 py-5 rounded-xl">
            <h2 className="text-xl font-semibold">Join</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onJoinGame();
              }}
            >
              <div className="py-4 flex flex-row gap-2 items-center">
                <input
                  value={inputCode}
                  className="p-2 bg-neutral-700 rounded-lg outline-amber-600"
                  onChange={(e) => {
                    if (e.target.value.length > 4) return;

                    setInputCode(e.target.value.toUpperCase());
                    setCodeError(false);
                  }}
                  placeholder="Enter code..."
                />
                <span className="">{inputCode.length}/4</span>
                {!codeLoading && (
                  <button
                    className="py-2 px-4 h-[41px] text-white bg-amber-600/50 rounded-lg hover:shadow-lg"
                    onClick={onJoinGame}
                    disabled={!isSocketConnected || inputCode.length !== 4}
                  >
                    Join Game
                  </button>
                )}
              </div>
              {codeError && <span className="">Invalid code</span>}
            </form>
          </div>
        </div>
      ) : (
        <div className="p-4 space-x-2 flex">
          <div className="flex flex-col">
            <input
              value={userName}
              maxLength={40}
              className="p-2 bg-neutral-500 rounded-lg focus:outline-amber-600"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              placeholder="Enter name..."
            />
            {nameError && (
              <span className="text-rose-600">be must 3 more character</span>
            )}
          </div>
          <button
            className="py-2 px-4 h-[41px] text-white bg-amber-600/50 rounded-lg hover:shadow-lg"
            onClick={onBuildGame}
          >
            Game Init
          </button>
        </div>
      )}
    </div>
  );
};

export default GameModal;
