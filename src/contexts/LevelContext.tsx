import { createContext, useContext, useState, ReactNode } from "react";
import { loadPlayer, savePlayer, addExp as addExpToPlayer } from "../lib/player";
import { PlayerState } from "@/types/player";

type LevelContextType = {
  level: number;
  exp: number;
  expToNext: number;
  addExp: (amount: number) => void;
  showLevelUp: boolean;
};

const LevelContext = createContext<LevelContextType | null>(null);

export function LevelProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<PlayerState>(() => loadPlayer());
  const [showLevelUp, setShowLevelUp] = useState(false);

  const addExp = (amount: number) => {
    const newPlayer = addExpToPlayer(player, amount);
    const leveled = newPlayer.level > player.level;
    setPlayer(newPlayer);
    savePlayer(newPlayer);

    if (leveled) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 2000);
    }
  };

  return (
    <LevelContext.Provider
      value={{
        level: player.level,
        exp: player.exp,
        expToNext: player.nextExp,
        addExp,
        showLevelUp,
      }}
    >
      {children}
    </LevelContext.Provider>
  );
}

export function useLevel() {
  const ctx = useContext(LevelContext);
  if (!ctx) throw new Error("useLevel must be used inside LevelProvider");
  return ctx;
}