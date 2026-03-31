import { useState } from "react";
import { Session, Socket } from "@heroiclabs/nakama-js";
import { authenticate } from "../lib/nakama/auth";
import { connectSocket } from "../lib/nakama/socket";
import { joinMatch, listenToMatch, sendMove } from "../lib/nakama/match";

export function useGame() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [state, setState] = useState<any>(null);

  async function initGame(matchIdInput: string) {
    const session = await authenticate();
    const sock = await connectSocket(session);

    setSocket(sock);
    setMatchId(matchIdInput);

    await joinMatch(sock, matchIdInput);

    listenToMatch(sock, (newState) => {
      setState(newState);
    });
  }

  function playMove(position: number) {
    if (!socket || !matchId) return;
    sendMove(socket, matchId, position);
  }

  return {
    initGame,
    playMove,
    state
  };
}