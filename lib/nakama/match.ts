import { Socket, Match, MatchData } from "@heroiclabs/nakama-js";

export async function joinMatch(socket: Socket, matchId: string): Promise<Match> {
  return await socket.joinMatch(matchId);
}

export function listenToMatch(socket: Socket, onUpdate: (state: any) => void): void {
  socket.onmatchdata = (data: MatchData) => {
    const decoded = new TextDecoder().decode(data.data);
    const state = JSON.parse(decoded);
    onUpdate(state);
  };
}

export function sendMove(socket: Socket, matchId: string, position: number): void {
  socket.sendMatchState(
    matchId,
    1,
    JSON.stringify({ position })
  );
}