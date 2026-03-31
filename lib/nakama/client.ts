import { Client } from "@heroiclabs/nakama-js";

const isBrowser = typeof window !== "undefined";

const host = "ram-tic-tac-toe.duckdns.org";
const port = "443";
const useSSL = true;

const client = new Client(
  "defaultkey",
  host,
  port,
  useSSL
);

export default client;