import { Client } from "@heroiclabs/nakama-js";

const isBrowser = typeof window !== "undefined";

const host = "34.100.165.40";

const client = new Client(
  "defaultkey",
  host,
  "7350",
  false
);

export default client;