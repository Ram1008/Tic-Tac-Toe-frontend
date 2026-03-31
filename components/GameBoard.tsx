"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Circle, Timer as TimerIcon, Power, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";

interface GameBoardProps {
  board: (string | null)[];
  onMove: (index: number) => void;
  currentPlayer: string;
  mySymbol: "X" | "O";
  players: { username: string; id: string; symbol: "X" | "O" }[];
  status: "playing" | "finished";
  winner?: string | null;
  matchId: string;
  mode: "classic" | "timed";
  timer: number;
  onLeave: () => void;
}

export default function GameBoard({
  board,
  onMove,
  currentPlayer,
  mySymbol,
  players,
  status,
  winner,
  matchId,
  mode,
  timer,
  onLeave
}: GameBoardProps) {
  const me = players.find(p => p.symbol === mySymbol);
  const opponent = players.find(p => p.symbol !== mySymbol);
  const isMyTurn = mySymbol === currentPlayer;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* HUD / Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <Button variant="glass" size="icon" onClick={onLeave}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full border-white/5">
          <Hash className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-mono text-muted-foreground tracking-tighter uppercase">Room: {matchId.slice(0, 8)}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(matchId)}>
            <Share2 className="w-3 h-3" />
          </Button>
        </div>
        {mode === "timed" && (
          <div className="glass px-4 py-2 rounded-full border-white/5 flex items-center space-x-2">
            {players.length === 2 ? (
              <>
                <TimerIcon className={cn("w-4 h-4", timer < 10 ? "text-destructive animate-pulse" : "text-primary")} />
                <span className={cn("text-lg font-display font-black min-w-[1.5rem] flex justify-center", timer < 10 ? "text-destructive" : "text-foreground")}>
                  {timer}
                </span>
              </>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">
                Waiting for opponent...
              </span>
            )}
          </div>
        )}
      </div>

      {/* Players Cards */}
      <div className="w-full grid grid-cols-2 gap-4 mb-8">
        {[me, opponent].map((player, idx) => (
          player && (
            <div 
              key={idx} 
              className={cn(
                "glass p-4 rounded-3xl transition-all duration-500 relative overflow-hidden",
                player.symbol === currentPlayer && status === "playing" ? "ring-2 ring-primary border-primary/20 scale-105" : "border-white/5 opacity-80"
              )}
            >
              {player.symbol === currentPlayer && status === "playing" && (
                <div className="absolute top-0 right-0 p-1 bg-primary text-[8px] font-black uppercase tracking-widest text-white px-2 rounded-bl-lg">
                  Active
                </div>
              )}
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black",
                  player.symbol === "X" ? "bg-x/20 text-x neon-border-x" : "bg-o/20 text-o neon-border-o"
                )}>
                  {player.symbol}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-xs uppercase tracking-widest text-muted-foreground truncate">
                    {idx === 0 ? "You" : "Opponent"}
                  </p>
                  <p className="font-display font-bold truncate text-sm">{player.username || "Joining..."}</p>
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Grid */}
      <div className="relative aspect-square w-full max-w-[400px] grid grid-cols-3 grid-rows-3 gap-3 p-3 glass rounded-[2.5rem] border-white/10 shadow-2xl">
        {board.map((cell, idx) => (
          <button
            key={idx}
            disabled={!!cell || !isMyTurn || status === "finished"}
            onClick={() => onMove(idx)}
            className={cn(
              "group relative flex items-center justify-center rounded-2xl transition-all duration-150 active:scale-90",
              !cell && isMyTurn ? "bg-white/5 hover:bg-white/10 border border-white/5" : "bg-white/[0.02]",
              cell === "X" && "neon-border-x",
              cell === "O" && "neon-border-o"
            )}
          >
            <AnimatePresence>
              {cell === "X" && (
                <motion.div
                  initial={{ scale: 0, rotate: -45, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  className="text-x text-shadow-x"
                >
                  <X className="w-16 h-16 md:w-20 md:h-20" strokeWidth={3} />
                </motion.div>
              )}
              {cell === "O" && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-o text-shadow-o"
                >
                  <Circle className="w-14 h-14 md:w-18 md:h-18" strokeWidth={4} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        ))}

        {/* Status Overlay */}
        <AnimatePresence>
          {status === "finished" && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[2.5rem] bg-black/40"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="text-center p-8"
              >
                <p className="text-xs font-black uppercase tracking-[0.4em] mb-2 text-primary">Match Ended</p>
                <h2 className={cn(
                  "text-5xl font-display font-black mb-8 italic tracking-tighter",
                  winner === mySymbol ? "text-x text-glow-x" : winner === "draw" ? "text-white" : "text-o text-glow-o"
                )}>
                  {winner === mySymbol ? "VICTORY" : winner === "draw" ? "DRAW" : "DEFEAT"}
                </h2>
                <div className="flex space-x-4">
                  <Button size="lg" onClick={onLeave} variant="glass">Main Menu</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isMyTurn && status === "playing" && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-muted-foreground text-xs uppercase font-black tracking-[0.2em] animate-pulse"
        >
          Waiting for opponent...
        </motion.p>
      )}
      
      {isMyTurn && status === "playing" && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-x text-xs uppercase font-black tracking-[0.2em] animate-bounce"
        >
          Your Turn
        </motion.p>
      )}
    </div>
  );
}

// Missing import fix
import { Hash } from "lucide-react";
