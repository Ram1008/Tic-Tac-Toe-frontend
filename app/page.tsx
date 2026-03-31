"use client";

import { useEffect, useState, useRef } from "react";
import { Session, Socket } from "@heroiclabs/nakama-js";
import { authenticate } from "@/lib/nakama/auth";
import { connectSocket, findMatches } from "@/lib/nakama/socket";
import client from "@/lib/nakama/client";
import Lobby from "@/components/Lobby";
import GameBoard from "@/components/GameBoard";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

type Screen = "LOADING" | "LOBBY" | "MATCHMAKING" | "GAME";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("LOADING");
  const [session, setSession] = useState<Session | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [matchId, setMatchId] = useState("");
  const [gameCode, setGameCode] = useState("");

  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [mySymbol, setMySymbol] = useState<"X" | "O">("X");
  const [players, setPlayers] = useState<any[]>([]);
  const [status, setStatus] = useState<"playing" | "finished">("playing");
  const [winner, setWinner] = useState<string | null>(null);
  
  const boardRef = useRef<(string | null)[]>(Array(9).fill(null));
  const currentPlayerRef = useRef("X");

  const [availableMatches, setAvailableMatches] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectionMode, setSelectionMode] = useState<"classic" | "timed" | null>(null);
  const [gameMode, setGameMode] = useState<"classic" | "timed">("classic");

  const [timer, setTimer] = useState(29);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  
  const [socketReady, setSocketReady] = useState(false);

  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // ---------------- INIT ----------------
  useEffect(() => {
    async function init() {
      try {
        const session = await authenticate();
        setSession(session);
        console.log("Connecting socket...");

        const socket = await connectSocket(session);

        console.log("Socket connected");

        socketRef.current = socket;

        setSocketReady(true);

        (socket as any).onclose = () => {
          console.warn("Socket closed");
          setSocketReady(false);
        };

        socket.onerror = (err) => {
          console.error("Socket error:", err);
        };

        // ---------------- MATCH DATA ----------------
        socket.onmatchdata = (result: any) => {
          try {
            const opCode = result.opCode ?? result.op_code;
            const dataString =
              result.data instanceof Uint8Array
                ? new TextDecoder().decode(result.data)
                : typeof result.data === "string" 
                  ? result.data 
                  : JSON.stringify(result.data);

            const content = JSON.parse(dataString);

            console.log(`📩 Received OpCode ${opCode}:`, content);

            if (opCode === 2) {
              const turnChanged = content.nextPlayer !== currentPlayerRef.current;
              const boardChanged = JSON.stringify(content.board) !== JSON.stringify(boardRef.current);

              if (turnChanged || boardChanged) {
                setTimer(29);
              }

              setBoard(content.board);
              boardRef.current = content.board;

              setCurrentPlayer(content.nextPlayer);
              currentPlayerRef.current = content.nextPlayer;

              setStatus(content.status);
              setWinner(content.winner);
              setGameMode(content.mode || "classic");

              if (content.players) {
                const mapped = content.players.map((p: any) => ({
                  username:
                    (p.userId || p.user_id) === session.user_id
                      ? "You"
                      : p.username || "Opponent",
                  id: p.userId || p.user_id,
                  symbol: p.symbol,
                }));
                setPlayers(mapped);
              }
            }
          } catch (err) {
            console.error("❌ Match data parse error:", err);
          }
        };

        socket.onmatchpresence = (presence: any) => {
          console.log("Presence update:", presence);
        };

        setScreen("LOBBY");
        fetchLeaderboard(session);
      } catch (err) {
        console.error("Init failed:", err);
      }
    }

    init();

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);

      if (socketRef.current) {
        socketRef.current.disconnect(false);
        socketRef.current = null;
      }
    };
  }, []);

  // ---------------- TIMER ----------------
  useEffect(() => {
    if (status === "playing" && screen === "GAME" && players.length === 2) {
      if (timerInterval.current) clearInterval(timerInterval.current);

      timerInterval.current = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
  }, [status, screen, currentPlayer, players.length]);

  // ---------------- LEADERBOARD ----------------
  const fetchLeaderboard = async (sess: Session) => {
    try {
      const res = await client.listLeaderboardRecords(
        sess,
        "global_rankings"
      );
      
      const parsedRecords = (res.records || []).map(record => ({
        ...record,
        metadata: typeof record.metadata === "string" ? JSON.parse(record.metadata) : record.metadata
      }));

      console.log("🏆 Loaded Live Leaderboard:", parsedRecords);
      setLeaderboard(parsedRecords);
    } catch (e) {
      console.warn("⚠️ Using Mock Leaderboard (Server or DB may be unreachable)");
      setLeaderboard([
        { username: "NexusCore", score: 124, metadata: { streak: 12, losses: 8 } },
        { username: "ShadowEdge", score: 98, metadata: { streak: 5, losses: 15 } },
        { username: "CyberPulse", score: 87, metadata: { streak: 3, losses: 22 } },
        { username: "VoidRunner", score: 76, metadata: { streak: 0, losses: 40 } },
      ]);
    }
  };

  // ---------------- MATCH BROWSER ----------------
  const handleRefreshMatches = async (mode: "classic" | "timed") => {
    if (!session) return;
    setIsRefreshing(true);
    setSelectionMode(mode);
    try {
      const matches = await findMatches(session, mode);
      // Filter out matches that are already starting or full
      setAvailableMatches(matches.filter((m: any) => (m.size ?? 0) < 2));
    } catch (err) {
      console.error("Failed to list matches:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleJoinByMatchId = async (id: string, code?: string) => {
    setScreen("MATCHMAKING");
    try {
      if (!session || !socketRef.current) return;
      await socketRef.current.joinMatch(id);
      
      setMatchId(id);
      if (code) setGameCode(code);
      setMySymbol("O");
      setPlayers([
        { username: "Opponent", id: "temp", symbol: "X" },
        { username: "You", id: session.user_id, symbol: "O" },
      ]);
      setScreen("GAME");
    } catch (err) {
      console.error("Match join failed:", err);
      setScreen("LOBBY");
    }
  };

  // ---------------- CREATE GAME ----------------
  const handleCreateGame = async (mode: "classic" | "timed") => {
    setScreen("MATCHMAKING");
    setSelectionMode(null);

    try {
      if (!session || !socketRef.current) return;

      const res = await client.rpc(session, "create_match", { mode });
      const data =
        typeof res.payload === "string"
          ? JSON.parse(res.payload)
          : res.payload;

      console.log("Create match response:", data);

      setMatchId(data.matchId);
      setGameCode(data.gameCode);

      await socketRef.current.joinMatch(data.matchId);

      setMySymbol("X");
      setPlayers([
        { username: "You", id: session.user_id, symbol: "X" },
      ]);

      setScreen("GAME");
    } catch (err) {
      console.error("Create game failed:", err);
      setScreen("LOBBY");
    }
  };

  // ---------------- JOIN GAME ----------------
  const handleJoinByCode = async (code: string) => {
    setScreen("MATCHMAKING");

    try {
      if (!session || !socketRef.current) return;
      
      const mode = selectionMode || "classic";
      const res = await client.rpc(session, "find_match_by_code", { code, mode });
      const data =
        typeof res.payload === "string"
          ? JSON.parse(res.payload)
          : res.payload;

      console.log("Join match response:", data);

      await socketRef.current.joinMatch(data.matchId);

      setMatchId(data.matchId);
      setMySymbol("O");

      setPlayers([
        { username: "Opponent", id: "temp", symbol: "X" },
        { username: "You", id: session.user_id, symbol: "O" },
      ]);

      setScreen("GAME");
    } catch (err) {
      console.error("Join failed:", err);
      setScreen("LOBBY");
    }
  };

  const handleAutoPair = async () => {
    if (availableMatches.length > 0) {
      // Join the first available match
      const m = availableMatches[0];
      handleJoinByMatchId(m.match_id);
    } else {
      alert("No active games found. Try creating one!");
    }
  };

  function isSocketReady(socket: Socket | null) {
    if (!socket) return false;

    const adapter = (socket as any).adapter;
    if (adapter && typeof adapter.isOpen === "function") {
      return adapter.isOpen();
    }

    // fallback (older versions)
    const ws = (socket as any).ws;
    return ws?.readyState === 1;
  }

  // ---------------- MOVE ----------------
  const handleMove = async (index: number) => {
    console.log("handleMove called with index:", index);

    const socket = socketRef.current;

    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    const ready = isSocketReady(socket);

    console.log("Move attempt details:", {
      index,
      myUserId: session?.user_id,
      matchId,
      socketReady: ready,
      status
    });

    if (!ready) {
      console.error("Socket not ready - blocking move");
      return;
    }

    if (!matchId) {
      console.error("No matchId");
      return;
    }

    if (status === "finished") {
      console.warn("Game already finished");
      return;
    }

    try {
      const data = JSON.stringify({ index });

      await socket.sendMatchState(matchId, 1, data);

      console.log("✅ Move sent");
    } catch (err) {
      console.error("❌ Failed to send move:", err);
    }
  };

  // ---------------- LEAVE ----------------
  const handleLeave = () => {
    if (socketRef.current && matchId) {
      socketRef.current.leaveMatch(matchId);
    }

    setScreen("LOBBY");
    setMatchId("");
    setBoard(Array(9).fill(null));
    setStatus("playing");
    setWinner(null);
  };

  // ---------------- UI ----------------
  return (
    <main className="min-h-screen flex items-center justify-center">
      <AnimatePresence mode="wait">
        {screen === "LOADING" && (
          <motion.div>
            <Loader2 className="w-10 h-10 animate-spin" />
          </motion.div>
        )}

        {screen === "LOBBY" && (
          <Lobby
            onCreateGame={handleCreateGame}
            onJoinGame={handleJoinByCode}
            onSelectMode={handleRefreshMatches}
            onJoinMatchId={handleJoinByMatchId}
            onAutoPair={handleAutoPair}
            onRefreshLeaderboard={() => session && fetchLeaderboard(session)}
            availableMatches={availableMatches}
            isLoadingMatches={isRefreshing}
            selectionMode={selectionMode}
            onCancelSelection={() => setSelectionMode(null)}
            leaderboard={leaderboard}
          />
        )}

        {screen === "MATCHMAKING" && (
          <div className="text-center">Connecting...</div>
        )}

        {screen === "GAME" && (
          <GameBoard
            board={board}
            onMove={handleMove}
            currentPlayer={currentPlayer}
            mySymbol={mySymbol}
            players={players}
            status={status}
            winner={winner}
            matchId={gameCode || matchId}
            mode={gameMode}
            timer={timer}
            onLeave={handleLeave}
          />
        )}
      </AnimatePresence>
    </main>
  );
}