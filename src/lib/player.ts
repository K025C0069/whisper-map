import { PlayerState } from "@/types/player";

const KEY = "whisper-player";

export function loadPlayer(): PlayerState {
  const saved = localStorage.getItem(KEY);
  if (saved) return JSON.parse(saved);

  return {
    level: 1,
    exp: 0,
    nextExp: 100,
  };
}

export function savePlayer(player: PlayerState) {
  localStorage.setItem(KEY, JSON.stringify(player));
}

export function addExp(player: PlayerState, amount: number): PlayerState {
  let newExp = player.exp + amount;
  let newLevel = player.level;
  let nextExp = player.nextExp;

  while (newExp >= nextExp) {
    newExp -= nextExp;
    newLevel += 1;
    nextExp = Math.floor(nextExp * 1.2); // レベルが上がるごとに必要経験値が増える
  }

  return {
    level: newLevel,
    exp: newExp,
    nextExp,
  };
}