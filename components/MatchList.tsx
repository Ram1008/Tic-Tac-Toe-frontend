"use client";

import { motion } from "framer-motion";
import { Users, ArrowRight, Activity, Plus, Zap } from "lucide-react";
import { Button } from "./ui/Button";

interface MatchListProps {
  matches: any[];
  onJoin: (matchId: string) => void;
  onCreateNew: () => void;
  onAutoPair: () => void;
  onBack: () => void;
  isLoading: boolean;
  mode: string;
}

export default function MatchList({ 
  matches, 
  onJoin, 
  onCreateNew, 
  onAutoPair,
  onBack,
  isLoading,
  mode 
}: MatchListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4 w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onBack}
          className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center"
        >
          <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
          Back to Modes
        </button>
        <div className="flex items-center text-[10px] font-black uppercase tracking-tighter text-primary/50 bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
          <Activity className="w-3 h-3 mr-1" />
          Live {mode} Games
        </div>
      </div>

      <Button 
        onClick={onCreateNew}
        variant="primary" 
        className="w-full h-14 space-x-2 shadow-lg shadow-primary/20"
      >
        <Plus className="w-5 h-5" />
        <span>Create New {mode} Match</span>
      </Button>
      
      <Button 
        onClick={onAutoPair}
        variant="glass" 
        disabled={isLoading}
        className="w-full h-14 space-x-2 border-primary/20 text-primary hover:bg-primary/5"
      >
        <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
          <Zap className="w-4 h-4 text-primary" fill="currentColor" />
        </div>
        <span className="font-bold uppercase tracking-wider text-xs">Automatic Pairing</span>
      </Button>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
          <span className="bg-background px-4 text-muted-foreground">Available to Join</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide pr-1">
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground text-sm animate-pulse">
            Scanning for active matches...
          </div>
        ) : matches.length > 0 ? (
          matches.map((match) => {
            const label = JSON.parse(match.label || "{}");
            return (
              <motion.div
                key={match.match_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all hover:bg-white/5"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary font-mono font-bold">
                    {label.gameCode.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-tight">Match {label.gameCode}</h4>
                    <div className="flex items-center text-[10px] text-muted-foreground uppercase font-black space-x-2">
                       <span className="flex items-center text-green-500">
                         <Users className="w-3 h-3 mr-1" />
                         {match.size}/2 Players
                       </span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => onJoin(match.match_id)}
                  size="sm" 
                  variant="glass"
                  className="group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/30 transition-all"
                >
                  Join
                </Button>
              </motion.div>
            );
          })
        ) : (
          <div className="py-12 text-center glass rounded-2xl border border-dashed border-white/10">
            <p className="text-muted-foreground text-sm font-medium mb-1">No active {mode} games</p>
            <p className="text-[10px] text-muted-foreground/50 uppercase font-bold tracking-tighter">Be the first to create one!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
