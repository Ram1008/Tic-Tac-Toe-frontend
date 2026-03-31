"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/Button";
import { Trophy, Plus, Hash, Clock, Users, Globe, Target, ShieldAlert, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MatchList from "./MatchList";

interface LobbyProps {
  onCreateGame: (mode: "classic" | "timed") => void;
  onJoinGame: (code: string) => void;
  onSelectMode: (mode: "classic" | "timed") => void;
  onJoinMatchId: (id: string, code?: string) => void;
  availableMatches: any[];
  isLoadingMatches: boolean;
  selectionMode: "classic" | "timed" | null;
  onCancelSelection: () => void;
  onRefreshLeaderboard: () => void;
  onAutoPair: () => void;
  leaderboard: any[];
}

export default function Lobby({ 
  onCreateGame, 
  onJoinGame, 
  onSelectMode,
  onJoinMatchId,
  availableMatches,
  isLoadingMatches,
  selectionMode,
  onCancelSelection,
  onRefreshLeaderboard,
  onAutoPair,
  leaderboard 
}: LobbyProps) {
  const [activeTab, setActiveTab] = useState<"play" | "leaderboard">("play");
  const [joinCode, setJoinCode] = useState("");

  const prevTabRef = useRef<"play" | "leaderboard">("play");

  useEffect(() => {
    if (activeTab === "leaderboard" && prevTabRef.current !== "leaderboard") {
      onRefreshLeaderboard();
    }
    prevTabRef.current = activeTab;
  }, [activeTab, onRefreshLeaderboard]);

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8 md:py-16 min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div className="flex items-center justify-center mb-12 space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)]">
            <span className="text-4xl font-black text-white italic">#</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-glow-primary">
            TIC <span className="text-primary">TAC</span> TOE
          </h1>
        </div>

        <div className="flex p-1 mb-8 glass rounded-2xl relative">
          <button
            onClick={() => setActiveTab("play")}
            className={`flex-1 flex items-center justify-center py-3 rounded-xl transition-all relative z-10 ${
              activeTab === "play" ? "text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            <span className="font-bold uppercase tracking-wider text-xs">Play</span>
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex-1 flex items-center justify-center py-3 rounded-xl transition-all relative z-10 ${
              activeTab === "leaderboard" ? "text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Trophy className="w-5 h-5 mr-2" />
            <span className="font-bold uppercase tracking-wider text-xs">Rankings</span>
          </button>
          <motion.div
            layoutId="activeTab"
            className="absolute inset-y-1 w-1/2 bg-primary rounded-xl shadow-lg"
            animate={{ x: activeTab === "play" ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "play" ? (
            <motion.div
              key="play"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <AnimatePresence mode="wait">
                {!selectionMode ? (
                  <motion.div
                    key="modes"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <Button 
                      onClick={() => onSelectMode("classic")}
                      variant="glass" 
                      className="flex-col h-auto py-8 space-y-3 border-white/5"
                    >
                      <Plus className="w-8 h-8 text-primary" />
                      <span className="font-bold">Classic</span>
                    </Button>
                    <Button 
                       onClick={() => onSelectMode("timed")}
                       variant="glass" 
                       className="flex-col h-auto py-8 space-y-3 border-white/5"
                    >
                      <Clock className="w-8 h-8 text-o" />
                      <span className="font-bold">Timed (30s)</span>
                    </Button>
                  </motion.div>
                ) : (
                  <MatchList 
                    mode={selectionMode}
                    matches={availableMatches}
                    isLoading={isLoadingMatches}
                    onJoin={(id) => onJoinMatchId(id)}
                    onCreateNew={() => onCreateGame(selectionMode)}
                    onAutoPair={onAutoPair}
                    onBack={onCancelSelection}
                  />
                )}
              </AnimatePresence>

              {!selectionMode && (
                <>
                  <div className="relative pt-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-4 text-muted-foreground font-medium">Or Use Invite Code</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <div className="relative flex-1">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="Enter Game Code"
                        className="w-full bg-white/5 border border-white/10 rounded-xl h-14 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono tracking-widest text-lg"
                      />
                    </div>
                    <Button 
                       onClick={() => onJoinGame(joinCode)}
                       variant="primary" 
                       size="lg" 
                       className="px-8"
                       disabled={!joinCode}
                    >
                      Join
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <h3 className="font-display font-bold text-lg">Global Legends</h3>
                <Globe className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="max-h-80 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {leaderboard.length > 0 ? (
                  leaderboard.map((player, idx) => (
                    <div key={idx} className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all hover:bg-white/[0.07]">
                      <div className="flex items-center space-x-4">
                         <div className="relative">
                            <span className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-sm italic transition-transform group-hover:scale-110 ${
                              idx === 0 ? "bg-yellow-500/20 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]" :
                              idx === 1 ? "bg-slate-300/20 text-slate-300" :
                              idx === 2 ? "bg-orange-600/20 text-orange-600" :
                              "bg-white/5 text-muted-foreground"
                            }`}>
                              {idx + 1}
                            </span>
                            {idx === 0 && <Trophy className="absolute -top-2 -left-2 w-4 h-4 text-yellow-500 -rotate-12" />}
                         </div>
                         <div>
                            <p className="font-display font-bold text-sm tracking-wide group-hover:text-primary transition-colors">{player.username || "Anonymous"}</p>
                            <div className="flex items-center space-x-2 mt-1">
                               <div className="flex items-center bg-green-500/10 px-1.5 py-0.5 rounded-md border border-green-500/20">
                                  <Target className="w-2.5 h-2.5 text-green-500 mr-1" />
                                  <span className="text-[9px] font-black text-green-500 uppercase">{player.score}W</span>
                               </div>
                               <div className="flex items-center bg-destructive/10 px-1.5 py-0.5 rounded-md border border-destructive/20">
                                  <ShieldAlert className="w-2.5 h-2.5 text-destructive mr-1" />
                                  <span className="text-[9px] font-black text-destructive uppercase">{player.metadata?.losses || 0}L</span>
                               </div>
                            </div>
                         </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="flex items-center text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full border border-orange-500/20">
                           <Flame className="w-3 h-3 mr-1 animate-pulse" fill="currentColor" />
                           <span className="text-[10px] font-black uppercase tracking-tighter">{player.metadata?.streak || 0} Streak</span>
                        </div>
                        <p className="text-[8px] text-muted-foreground uppercase font-black mt-2 tracking-widest opacity-50">Global Ranking</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-muted-foreground italic">
                    No records found yet...
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
