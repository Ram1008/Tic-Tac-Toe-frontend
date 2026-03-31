import { Session, Socket } from "@heroiclabs/nakama-js";
import client from "./client";

export async function connectSocket(session: Session): Promise<Socket> {
  const socket = client.createSocket();
  await socket.connect(session, true);

  return socket;
}

export async function findMatches(session: Session, mode: string) {
  // Fetch all authoritative matches and filter by mode and status in the JSON label
  const result = await client.listMatches(session, 50, true, "", 0, 2, "");
  const matches = result.matches || [];
  
  return matches.filter(m => {
    try {
      const label = JSON.parse(m.label || "{}");
      // Only show matches that match the mode AND are still open (not full or finished)
      return label.mode === mode && label.status === "open";
    } catch (e) {
      return false;
    }
  });
}