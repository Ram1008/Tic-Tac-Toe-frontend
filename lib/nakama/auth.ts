import { Session } from "@heroiclabs/nakama-js";
import client from "./client";
import { v4 as uuidv4 } from "uuid";

export async function authenticate(): Promise<Session> {
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem("deviceId", deviceId);
  }

  const session = await client.authenticateDevice(deviceId, true);

  return session;
}