export interface PlayerState {
  id: string;
  wordIndex: number;
  playAgain?: boolean;
  disconnected?: boolean;
  name: string;
}

export interface GameState {
  players: { owner: PlayerState; guest?: PlayerState };
  quoteLength: quoteLengthType;
  testText?: string;
}

export type quoteLengthType = "short" | "long";

export interface Rooms {
  [key: string]: string;
}
