"use client";
import { FC } from "react";

interface WaitingBoardProps {
  gameCode: string;
  userName: string;
}

const WaitingBoard: FC<WaitingBoardProps> = ({ gameCode, userName }) => {
  return (
    <div className="flex flex-col gap-2 max-w-3xl mx-auto items-center">
      <div className="my-10">
        <span className="">Game Code: </span>
        <span className="font-bold">{gameCode}</span>
        {/* TODO: Code copy button */}
      </div>

      <div className="flex flex-col gap-5 md:flex-row items-center">
        <div className="bg-orange-500 w-48 h-48 rounded-3xl flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold">{userName}</span>
          <span>You</span>
        </div>
        <span className="">vs</span>
        <div className="bg-neutral-600 w-48 h-48 gap-3 rounded-3xl flex flex-col items-center justify-center">
          <span className="text-white font-bold">Opponent</span>
          <div className="text-white">Waiting...</div>
        </div>
      </div>
    </div>
  );
};

export default WaitingBoard;
